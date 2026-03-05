
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import time
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import datetime

# --- 1. 全局配置与模型参数 ---
# 物理参数 (需要根据实际染整工艺进行精确设定和验证)
# 染浴初始染料浓度 (g/L)
C_bath_initial = 10.0
# 纤维总表面积 (cm^2)
A_fiber_total = 1000.0
# 染浴体积 (L)
V_bath = 1.0
# 染浴-纤维界面质量传递系数 (cm/min)
k_m = 0.01
# 染料在纤维中的有效扩散系数 (cm^2/min)
D_eff = 0.001
# 纤维的特征扩散长度 (cm), 简化为半厚度或半径
L_fiber = 0.005
# 模拟总时间 (min)
T_max = 120.0

# PINNs 训练参数
LEARNING_RATE = 1e-4
EPOCHS = 50000
NUM_HIDDEN_LAYERS = 6
NEURONS_PER_LAYER = 60
ACTIVATION_FUNCTION = 'tanh' # 或 'swish'
LAMBDA_PDE = 1.0 # PDE 损失权重
LAMBDA_ODE = 1.0 # ODE 损失权重
LAMBDA_BC = 10.0 # 边界条件损失权重
LAMBDA_IC = 10.0 # 初始条件损失权重

# 碰撞点数量
N_COLLOCATION_PDE = 5000 # PDE 损失计算点
N_COLLOCATION_ODE = 1000 # ODE 损失计算点
N_BC = 500 # 边界条件点
N_IC = 500 # 初始条件点

# 模型保存路径
MODEL_PATH = "dyeing_pinn_model"

# --- 2. 神经网络模型定义 ---
class PINN(tf.keras.Model):
    def __init__(self, num_hidden_layers, neurons_per_layer, activation_function, output_dim=2):
        super(PINN, self).__init__()
        self.dense_layers = []
        # 输入层
        self.dense_layers.append(layers.Dense(neurons_per_layer, activation=activation_function, kernel_initializer='glorot_normal'))
        # 隐藏层
        for _ in range(num_hidden_layers - 1): # -1 是因为输入层已经算作第一层
            self.dense_layers.append(layers.Dense(neurons_per_layer, activation=activation_function, kernel_initializer='glorot_normal'))
        # 输出层，输出 [C_bath_pred, C_fiber_pred]
        self.output_layer = layers.Dense(output_dim)

    def call(self, inputs):
        # inputs 是 (t, x)
        z = inputs
        for layer in self.dense_layers:
            z = layer(z)
        output = self.output_layer(z)
        return output

    # 预测染浴浓度和纤维浓度
    def predict_concentrations(self, t, x):
        inputs = tf.stack([t, x], axis=1) # (N, 2)
        outputs = self(inputs)
        C_bath_pred = outputs[:, 0:1] # 染浴浓度 (N, 1)
        C_fiber_pred = outputs[:, 1:2] # 纤维浓度 (N, 1)
        return C_bath_pred, C_fiber_pred

# --- 3. 物理损失函数定义 ---
def calculate_losses(model, t_collocation_pde, x_collocation_pde,
                     t_collocation_ode,
                     t_ic, x_ic, t_bc, x_bc_surface, x_bc_center):

    # 3.1 PDE 损失 (Fick's 第二定律 for C_fiber)
    with tf.GradientTape(persistent=True) as tape_pde:
        tape_pde.watch([t_collocation_pde, x_collocation_pde])
        # 预测染浴浓度和纤维浓度在 PDE 碰撞点
        _, C_fiber_pred_pde = model.predict_concentrations(t_collocation_pde, x_collocation_pde)

        # 计算 C_fiber 对 t 的一阶导数 (dC_fiber/dt)
        C_fiber_t = tape_pde.gradient(C_fiber_pred_pde, t_collocation_pde)

        # 计算 C_fiber 对 x 的一阶导数 (dC_fiber/dx)
        C_fiber_x = tape_pde.gradient(C_fiber_pred_pde, x_collocation_pde)

        # 计算 C_fiber 对 x 的二阶导数 (d^2C_fiber/dx^2)
        C_fiber_xx = tape_pde.gradient(C_fiber_x, x_collocation_pde)

    # PDE 方程残差: dC_fiber/dt - D_eff * d^2C_fiber/dx^2 = 0
    pde_loss_fiber = tf.reduce_mean(tf.square(C_fiber_t - D_eff * C_fiber_xx))

    # 3.2 ODE 损失 (物料平衡 for C_bath)
    with tf.GradientTape(persistent=True) as tape_ode:
        tape_ode.watch(t_collocation_ode)
        # 预测染浴浓度和纤维浓度在 ODE 碰撞点
        C_bath_pred_ode, C_fiber_pred_ode_surface = model.predict_concentrations(t_collocation_ode, tf.zeros_like(t_collocation_ode))

        # 计算 C_bath 对 t 的一阶导数 (dC_bath/dt)
        C_bath_t = tape_ode.gradient(C_bath_pred_ode, t_collocation_ode)

    # ODE 方程残差: dC_bath/dt + (A_fiber_total / V_bath) * k_m * (C_bath - C_fiber(x=0, t)) = 0
    # 注意：这里 C_fiber(x=0, t) 是从预测中获取的纤维表面浓度
    ode_loss_bath = tf.reduce_mean(tf.square(C_bath_t + (A_fiber_total / V_bath) * k_m * (C_bath_pred_ode - C_fiber_pred_ode_surface)))

    # 3.3 边界条件 (BC) 损失
    # BC 1: 纤维表面通量平衡 (x=0)
    with tf.GradientTape(persistent=True) as tape_bc_surface:
        tape_bc_surface.watch(t_bc)
        _, C_fiber_pred_bc_surface = model.predict_concentrations(t_bc, x_bc_surface) # x_bc_surface 应该是 tf.zeros_like(t_bc)
        C_bath_pred_bc = model.predict_concentrations(t_bc, x_bc_surface)[0] # 获取在边界点的染浴浓度预测

        C_fiber_x_bc_surface = tape_bc_surface.gradient(C_fiber_pred_bc_surface, x_bc_surface)

    # -D_eff * dC_fiber/dx |_(x=0) = k_m * (C_bath - C_fiber(x=0, t))
    bc_loss_fiber_surface = tf.reduce_mean(tf.square(-D_eff * C_fiber_x_bc_surface - k_m * (C_bath_pred_bc - C_fiber_pred_bc_surface)))

    # BC 2: 纤维中心无通量 (x=L_fiber)
    with tf.GradientTape(persistent=True) as tape_bc_center:
        tape_bc_center.watch(x_bc_center) # x_bc_center 应该是 L_fiber * tf.ones_like(t_bc)
        _, C_fiber_pred_bc_center = model.predict_concentrations(t_bc, x_bc_center)

        C_fiber_x_bc_center = tape_bc_center.gradient(C_fiber_pred_bc_center, x_bc_center)

    # dC_fiber/dx |_(x=L_fiber) = 0
    bc_loss_fiber_center = tf.reduce_mean(tf.square(C_fiber_x_bc_center))

    # 3.4 初始条件 (IC) 损失
    # IC 1: 初始染浴浓度
    C_bath_pred_ic, _ = model.predict_concentrations(t_ic, x_ic) # t_ic 应该是 tf.zeros_like(x_ic)

    ic_loss_bath = tf.reduce_mean(tf.square(C_bath_pred_ic - C_bath_initial))

    # IC 2: 初始纤维浓度 (x 属于 [0, L_fiber])
    _, C_fiber_pred_ic = model.predict_concentrations(t_ic, x_ic) # t_ic 应该是 tf.zeros_like(x_ic)

    ic_loss_fiber = tf.reduce_mean(tf.square(C_fiber_pred_ic - 0.0)) # 初始纤维浓度为 0

    # 释放 tape
    del tape_pde, tape_ode, tape_bc_surface, tape_bc_center

    # 总损失
    total_loss = (LAMBDA_PDE * pde_loss_fiber +
                  LAMBDA_ODE * ode_loss_bath +
                  LAMBDA_BC * bc_loss_fiber_surface +
                  LAMBDA_BC * bc_loss_fiber_center +
                  LAMBDA_IC * ic_loss_bath +
                  LAMBDA_IC * ic_loss_fiber)

    return total_loss, pde_loss_fiber, ode_loss_bath, bc_loss_fiber_surface, bc_loss_fiber_center, ic_loss_bath, ic_loss_fiber

# --- 4. 数据点生成 ---
def generate_training_data():
    # PDE 碰撞点: 随机采样 t 和 x
    t_collocation_pde = tf.random.uniform((N_COLLOCATION_PDE, 1), minval=0.0, maxval=T_max, dtype=tf.float32)
    x_collocation_pde = tf.random.uniform((N_COLLOCATION_PDE, 1), minval=0.0, maxval=L_fiber, dtype=tf.float32)

    # ODE 碰撞点: 随机采样 t
    t_collocation_ode = tf.random.uniform((N_COLLOCATION_ODE, 1), minval=0.0, maxval=T_max, dtype=tf.float32)

    # 初始条件点: t=0, 随机采样 x
    t_ic = tf.zeros((N_IC, 1), dtype=tf.float32)
    x_ic = tf.random.uniform((N_IC, 1), minval=0.0, maxval=L_fiber, dtype=tf.float32)

    # 边界条件点: 随机采样 t
    t_bc = tf.random.uniform((N_BC, 1), minval=0.0, maxval=T_max, dtype=tf.float32)
    x_bc_surface = tf.zeros_like(t_bc) # x=0
    x_bc_center = L_fiber * tf.ones_like(t_bc) # x=L_fiber

    return t_collocation_pde, x_collocation_pde, t_collocation_ode, t_ic, x_ic, t_bc, x_bc_surface, x_bc_center

# --- 5. 训练函数 ---
def train_pinn_model(model, optimizer, t_collocation_pde, x_collocation_pde,
                      t_collocation_ode, t_ic, x_ic, t_bc, x_bc_surface, x_bc_center):
    
    @tf.function
    def train_step():
        with tf.GradientTape() as tape:
            total_loss, pde_loss_fiber, ode_loss_bath, bc_loss_fiber_surface, bc_loss_fiber_center, ic_loss_bath, ic_loss_fiber = calculate_losses(
                model, t_collocation_pde, x_collocation_pde, t_collocation_ode,
                t_ic, x_ic, t_bc, x_bc_surface, x_bc_center
            )
        gradients = tape.gradient(total_loss, model.trainable_variables)
        optimizer.apply_gradients(zip(gradients, model.trainable_variables))
        return total_loss, pde_loss_fiber, ode_loss_bath, bc_loss_fiber_surface, bc_loss_fiber_center, ic_loss_bath, ic_loss_fiber

    print(f"开始训练，Epochs: {EPOCHS}, Learning Rate: {LEARNING_RATE}")
    start_time = time.time()

    for epoch in range(EPOCHS):
        total_loss, pde_loss_fiber, ode_loss_bath, bc_loss_fiber_surface, bc_loss_fiber_center, ic_loss_bath, ic_loss_fiber = train_step()

        if epoch % 1000 == 0:
            elapsed = time.time() - start_time
            print(f"Epoch {epoch:05d}, Total Loss: {total_loss.numpy():.4e}, "
                  f"PDE Loss: {pde_loss_fiber.numpy():.4e}, ODE Loss: {ode_loss_bath.numpy():.4e}, "
                  f"BC Surface Loss: {bc_loss_fiber_surface.numpy():.4e}, BC Center Loss: {bc_loss_fiber_center.numpy():.4e}, "
                  f"IC Bath Loss: {ic_loss_bath.numpy():.4e}, IC Fiber Loss: {ic_loss_fiber.numpy():.4e} "
                  f"({elapsed:.2f}s)")
            start_time = time.time()
            # if total_loss.numpy() < 1e-5: # early stopping
            #     print(f"Early stopping at epoch {epoch} due to low total loss.")
            #     break
    print("训练完成。")


# --- 7. FastAPI API 定义 ---
app = FastAPI(
    title="染整颜色在线预测 PINNs 模型",
    description="基于物理信息神经网络 (PINNs) 的染整染料浓度预测 API，整合物料平衡、吸附和扩散过程。"
)

class PredictRequest(BaseModel):
    t: float # 时间 (min)
    x: float = 0.0 # 空间位置 (cm), 默认为纤维表面

@app.on_event("startup")
async def startup_event():
    global pinn_model
    pinn_model = load_pinn_model()
    if pinn_model is None:
        print("模型未找到或加载失败，正在进行训练...")
        pinn_model = PINN(NUM_HIDDEN_LAYERS, NEURONS_PER_LAYER, ACTIVATION_FUNCTION)
        optimizer = tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE)
        
        t_collocation_pde, x_collocation_pde, t_collocation_ode, t_ic, x_ic, t_bc, x_bc_surface, x_bc_center = generate_training_data()
        train_pinn_model(pinn_model, optimizer, t_collocation_pde, x_collocation_pde, t_collocation_ode, t_ic, x_ic, t_bc, x_bc_surface, x_bc_center)
        save_pinn_model(pinn_model)
    else:
        # 如果模型已加载，可以进行一次简单的预测验证
        print("模型已加载，进行快速验证...")
        test_t = tf.constant([[T_max / 2]], dtype=tf.float32)
        test_x = tf.constant([[L_fiber / 2]], dtype=tf.float32)
        C_bath_pred_test, C_fiber_pred_test = pinn_model.predict_concentrations(test_t, test_x)
        print(f"验证预测 (t={test_t.numpy()[0][0]:.2f}, x={test_x.numpy()[0][0]:.4f}): "
              f"C_bath={C_bath_pred_test.numpy()[0][0]:.4f}, C_fiber={C_fiber_pred_test.numpy()[0][0]:.4f}")

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": pinn_model is not None, "current_time": datetime.datetime.now().isoformat()}

@app.post("/predict")
async def predict_concentrations_api(request: PredictRequest):
    global pinn_model
    if pinn_model is None:
        raise HTTPException(status_code=503, detail="模型尚未加载或训练完成，请稍后再试。")

    # 输入验证和转换
    t_input = tf.constant([[request.t]], dtype=tf.float32)
    x_input = tf.constant([[request.x]], dtype=tf.float32)

    # 确保输入在物理范围内
    if not (0 <= request.t <= T_max and 0 <= request.x <= L_fiber):
        raise HTTPException(status_code=400, detail=f"输入参数超出范围: t 应在 [0, {T_max}] 内, x 应在 [0, {L_fiber}] 内")

    try:
        C_bath_pred, C_fiber_pred = pinn_model.predict_concentrations(t_input, x_input)
        return {"t": request.t, "x": request.x, "C_bath_pred": C_bath_pred.numpy()[0][0], "C_fiber_pred": C_fiber_pred.numpy()[0][0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"预测过程中发生错误: {str(e)}")

# --- 主执行逻辑 ---
if __name__ == "__main__":
    # 在独立运行或调试时使用，在部署时通常由 uvicorn 命令行启动
    print("正在启动 FastAPI 服务器...")
    uvicorn.run(app, host="0.0.0.0", port=8000)



