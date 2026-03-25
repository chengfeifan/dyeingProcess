-- database.sql
-- 染整智能化数据库DDL (PostgreSQL + TimescaleDB)

-- 1. 创建数据库 (如果不存在)
-- 在实际部署中，通常会手动创建数据库或在Docker Compose中指定
-- CREATE DATABASE dyeing_process_ai;
-- \c dyeing_process_ai; -- 连接到新创建的数据库

-- 2. 启用 TimescaleDB 扩展
-- 必须在每个数据库中启用一次
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 3. 用户与权限 (示例，请根据实际情况调整)
-- CREATE USER dyeing_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE dyeing_process_ai TO dyeing_user;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO dyeing_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO dyeing_user;

-- 4. 表结构定义

-- 设备信息表 (主数据)
CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    equipment_code VARCHAR(50) UNIQUE NOT NULL, -- 设备编号
    equipment_name VARCHAR(100) NOT NULL,       -- 设备名称
    equipment_type VARCHAR(50),                 -- 设备类型 (如：染色机, 定型机)
    location VARCHAR(100),                      -- 安装位置
    manufacturer VARCHAR(100),                  -- 制造商
    model VARCHAR(50),                          -- 型号
    installed_date DATE,                        -- 安装日期
    status VARCHAR(20) DEFAULT 'active',        -- 设备状态 (active, maintenance, inactive)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_equipments_code ON equipments(equipment_code);
CREATE INDEX idx_equipments_type ON equipments(equipment_type);

-- 染料配方表 (主数据)
CREATE TABLE dye_recipes (
    id SERIAL PRIMARY KEY,
    recipe_code VARCHAR(50) UNIQUE NOT NULL,    -- 配方编号
    recipe_name VARCHAR(200) NOT NULL,          -- 配方名称
    fabric_type VARCHAR(100),                   -- 面料类型
    color_name VARCHAR(100),                    -- 颜色名称
    batch_size_kg NUMERIC(10, 2),               -- 标准批次量 (kg)
    bath_ratio NUMERIC(5, 2),                   -- 浴比
    total_liquor_volume_l NUMERIC(10, 2),       -- 总液量 (L)
    main_dye_temp_c NUMERIC(5, 2),              -- 主染温度 (摄氏度)
    main_dye_time_min NUMERIC(5, 2),            -- 主染时间 (分钟)
    ph_value_target NUMERIC(4, 2),              -- 目标pH值
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dye_recipes_code ON dye_recipes(recipe_code);
CREATE INDEX idx_dye_recipes_fabric_color ON dye_recipes(fabric_type, color_name);

-- 配方详情表 (染料、助剂用量)
CREATE TABLE recipe_details (
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES dye_recipes(id) ON DELETE CASCADE,
    material_name VARCHAR(100) NOT NULL,        -- 染料或助剂名称
    material_type VARCHAR(50) NOT NULL,         -- 类型 (dye, auxiliary)
    concentration_g_l NUMERIC(10, 4),           -- 浓度 (g/L)
    dosage_percentage NUMERIC(6, 4),            -- 用量百分比 (owf%)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_recipe_details_recipe_id ON recipe_details(recipe_id);

-- 工艺步骤定义表 (主数据)
CREATE TABLE process_steps (
    id SERIAL PRIMARY KEY,
    step_code VARCHAR(50) UNIQUE NOT NULL,      -- 步骤编号
    step_name VARCHAR(100) NOT NULL,            -- 步骤名称 (如：进水, 加染料, 升温, 保温, 降温, 排水, 皂洗)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_process_steps_code ON process_steps(step_code);

-- 订单表
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,     -- 订单编号
    customer_name VARCHAR(100) NOT NULL,        -- 客户名称
    product_name VARCHAR(200) NOT NULL,         -- 产品名称
    total_quantity_kg NUMERIC(10, 2) NOT NULL,  -- 订单总量 (kg)
    delivery_date DATE,                         -- 交货日期
    status VARCHAR(20) DEFAULT 'pending',       -- 订单状态 (pending, in_progress, completed, cancelled)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_orders_customer ON orders(customer_name);

-- 生产批次表
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    batch_code VARCHAR(50) UNIQUE NOT NULL,     -- 批次编号
    order_id INT REFERENCES orders(id) ON DELETE SET NULL, -- 关联订单
    equipment_id INT REFERENCES equipments(id) ON DELETE SET NULL, -- 关联设备
    dye_recipe_id INT REFERENCES dye_recipes(id) ON DELETE SET NULL, -- 关联配方
    actual_batch_weight_kg NUMERIC(10, 2),      -- 实际投料重量 (kg)
    start_time TIMESTAMP WITH TIME ZONE,        -- 实际开始时间
    end_time TIMESTAMP WITH TIME ZONE,          -- 实际结束时间
    status VARCHAR(20) DEFAULT 'scheduled',     -- 批次状态 (scheduled, running, completed, quality_fail)
    operator VARCHAR(50),                       -- 操作员
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_batches_code ON batches(batch_code);
CREATE INDEX idx_batches_order_id ON batches(order_id);
CREATE INDEX idx_batches_equipment_id ON batches(equipment_id);
CREATE INDEX idx_batches_dye_recipe_id ON batches(dye_recipe_id);
CREATE INDEX idx_batches_time_range ON batches(start_time, end_time);

-- 批次工艺参数表 (记录每个批次每个工艺步骤的实际参数)
CREATE TABLE batch_process_params (
    id SERIAL PRIMARY KEY,
    batch_id INT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    process_step_id INT NOT NULL REFERENCES process_steps(id) ON DELETE RESTRICT, -- 关联工艺步骤
    param_name VARCHAR(100) NOT NULL,           -- 参数名称 (如：温度, 时间, pH, 流量)
    param_value NUMERIC(10, 4),                 -- 实际参数值
    unit VARCHAR(20),                           -- 单位
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_batch_process_params_batch_step ON batch_process_params(batch_id, process_step_id);
CREATE INDEX idx_batch_process_params_time ON batch_process_params(recorded_at);

-- 在线监测数据表 (TimescaleDB Hypertable)
CREATE TABLE sensor_data (
    time TIMESTAMP WITH TIME ZONE NOT NULL,     -- 时间戳 (TimescaleDB 分区键)
    equipment_id INT NOT NULL REFERENCES equipments(id) ON DELETE RESTRICT, -- 关联设备
    batch_id INT REFERENCES batches(id) ON DELETE SET NULL, -- 关联当前运行批次 (可选)
    sensor_type VARCHAR(50) NOT NULL,           -- 传感器类型 (如：pH, Temp, Spectro, Flow)
    sensor_value NUMERIC(10, 4) NOT NULL,       -- 传感器数值
    unit VARCHAR(20),                           -- 单位
    data_source VARCHAR(50)                     -- 数据来源 (如：PLC, DCS, Manual)
);
SELECT create_hypertable('sensor_data', 'time');
-- 为 TimescaleDB Hypertable 创建复合索引以优化查询
CREATE INDEX idx_sensor_data_time_equipment_batch ON sensor_data(time DESC, equipment_id, batch_id);
CREATE INDEX idx_sensor_data_sensor_type ON sensor_data(sensor_type);


-- AI 模型元数据表
CREATE TABLE ai_model_metadata (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) UNIQUE NOT NULL,    -- 模型名称 (如：打样预测模型, 上染率预测模型)
    version VARCHAR(50) NOT NULL,               -- 模型版本
    model_type VARCHAR(50),                     -- 模型类型 (如：regression, classification, time_series_forecast)
    training_data_start TIMESTAMP WITH TIME ZONE, -- 训练数据起始时间
    training_data_end TIMESTAMP WITH TIME ZONE,   -- 训练数据结束时间
    training_metrics JSONB,                     -- 训练评估指标 (JSONB 格式，如 {"mse": 0.01, "r2": 0.95})
    deployed_status VARCHAR(20) DEFAULT 'inactive', -- 部署状态 (inactive, active, retired)
    deployed_at TIMESTAMP WITH TIME ZONE,       -- 部署时间
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ai_model_metadata_name_version ON ai_model_metadata(model_name, version);

-- AI 预测结果表
CREATE TABLE ai_prediction_results (
    id SERIAL PRIMARY KEY,
    model_id INT NOT NULL REFERENCES ai_model_metadata(id) ON DELETE RESTRICT,
    batch_id INT REFERENCES batches(id) ON DELETE SET NULL, -- 关联批次 (如果预测与批次相关)
    equipment_id INT REFERENCES equipments(id) ON DELETE SET NULL, -- 关联设备 (如果预测与设备相关)
    prediction_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- 预测时间
    input_features JSONB,                       -- 模型输入特征 (JSONB 格式)
    prediction_output JSONB NOT NULL,           -- 预测结果 (JSONB 格式，如 {"target_ph": 7.2, "confidence": 0.85})
    recommendation TEXT,                        -- AI 推荐建议
    action_taken BOOLEAN DEFAULT FALSE,         -- 建议是否被采纳
    action_time TIMESTAMP WITH TIME ZONE,       -- 建议采纳时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ai_prediction_results_model_batch ON ai_prediction_results(model_id, batch_id);
CREATE INDEX idx_ai_prediction_results_time ON ai_prediction_results(prediction_time DESC);

-- 质量检测结果表 (QMS相关)
CREATE TABLE quality_checks (
    id SERIAL PRIMARY KEY,
    batch_id INT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    check_item VARCHAR(100) NOT NULL,           -- 检测项目 (如：色差, 牢度, pH)
    actual_value NUMERIC(10, 4) NOT NULL,       -- 检测实际值
    target_value_min NUMERIC(10, 4),            -- 目标最小值
    target_value_max NUMERIC(10, 4),            -- 目标最大值
    is_qualified BOOLEAN NOT NULL,              -- 是否合格
    checker VARCHAR(50),                        -- 检测人
    check_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quality_checks_batch_item ON quality_checks(batch_id, check_item);
CREATE INDEX idx_quality_checks_time ON quality_checks(check_time);

-- 报警与事件表
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    equipment_id INT REFERENCES equipments(id) ON DELETE SET NULL,
    batch_id INT REFERENCES batches(id) ON DELETE SET NULL,
    alert_type VARCHAR(50) NOT NULL,            -- 报警类型 (如：超限报警, 设备故障, AI异常)
    severity VARCHAR(20) NOT NULL,              -- 严重程度 (如：low, medium, high, critical)
    message TEXT NOT NULL,                      -- 报警信息
    is_resolved BOOLEAN DEFAULT FALSE,          -- 是否已解决
    resolved_by VARCHAR(50),                    -- 解决人
    resolved_at TIMESTAMP WITH TIME ZONE,       -- 解决时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_alerts_time ON alerts(time DESC);
CREATE INDEX idx_alerts_equipment_batch ON alerts(equipment_id, batch_id);
