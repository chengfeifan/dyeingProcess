
# main.py
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import httpx # 用于发起HTTP请求
import os

app = FastAPI(title="OpenClaw Integration Demo")

# 配置模板目录（用于返回HTML页面）
templates = Jinja2Templates(directory="templates")

# 配置静态文件目录（如果需要提供前端JS/CSS/图片等）
# app.mount("/static", StaticFiles(directory="static"), name="static")

# OpenClaw Gateway的URL和API Key
# 注意：在生产环境中，这些敏感信息应该从环境变量或密钥管理服务中获取
OPENCLAW_GATEWAY_URL = os.getenv("OPENCLAW_GATEWAY_URL", "http://localhost:9000") # 假设OpenClaw Gateway运行在9000端口
OPENCLAW_API_KEY = os.getenv("OPENCLAW_API_KEY", "YOUR_OPENCLAW_API_KEY") # 替换为您的OpenClaw API Key

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """
    根路径，返回一个简单的HTML页面，包含调用OpenClaw的按钮。
    """
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/call_openclaw")
async def call_openclaw_agent(command_payload: dict):
    """
    接收前端发送的OpenClaw命令，转发给OpenClaw Gateway，并返回结果。
    command_payload 示例: {"tool": "default_api.exec", "kwargs": {"command": "ls -l"}}
    """
    if not OPENCLAW_API_KEY or OPENCLAW_API_KEY == "YOUR_OPENCLAW_API_KEY":
        return JSONResponse(
            status_code=500,
            content={"error": "OpenClaw API Key is not configured. Please set OPENCLAW_API_KEY environment variable."}
        )

    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENCLAW_API_KEY}" # 根据OpenClaw Gateway的认证方式调整
        }
        # 构建发送给OpenClaw Gateway的请求体
        # OpenClaw Gateway通常接受一个包含tool和kwargs的JSON对象
        # 示例：{"tool": "default_api.exec", "kwargs": {"command": "ls -l"}}
        openclaw_request_body = command_payload

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OPENCLAW_GATEWAY_URL}/api/v1/commands", # Gateway的命令接收端点
                json=openclaw_request_body,
                headers=headers,
                timeout=30.0 # 设置超时时间
            )
            response.raise_for_status() # 如果状态码不是2xx，则抛出异常

            openclaw_result = response.json()

            # 这里可以根据openclaw_result的结构进行进一步处理
            # 例如，如果OpenClaw返回的是一个文件内容，你可以提取出来
            # 如果是exec命令的结果，你可以提取stdout/stderr
            
            # 简单地返回OpenClaw的原始结果
            return JSONResponse(content=openclaw_result)

    except httpx.RequestError as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to connect to OpenClaw Gateway: {e}"}
        )
    except httpx.HTTPStatusError as e:
        return JSONResponse(
            status_code=e.response.status_code,
            content={"error": f"OpenClaw Gateway returned an error: {e.response.text}"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"An unexpected error occurred: {e}"}
        )

# 运行 FastAPI 应用: uvicorn main:app --reload
