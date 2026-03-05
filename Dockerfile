# Dockerfile for Dyeing PINNs Prediction API

# 使用官方 Python 基础镜像
FROM python:3.9-slim-buster

# 设置工作目录
WORKDIR /app

# 复制 requirements.txt 并安装依赖
# 使用 --no-cache-dir 减少镜像大小
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY main.py .

# 暴露 FastAPI 默认端口
EXPOSE 8000

# 启动 Uvicorn 服务器
# --host 0.0.0.0 允许从任何网络接口访问
# --workers 1 初始设置为单 worker，可根据需求调整
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]