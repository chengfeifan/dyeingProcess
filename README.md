# 染整智能化系统（前后端一键部署）

## 后端能力
- 智能看板 KPI
- 智能排产
- AI 配方推荐
- 生产预警
- 能耗、质量、预测维护查询

## 本地开发
### 后端
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

## 服务器一键部署（Docker + Nginx）
> 适用于 Ubuntu/CentOS 等云服务器，要求已安装 Docker 与 Docker Compose Plugin。

```bash
git clone <你的仓库地址>
cd dyeingProcess
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

部署后访问：
- 前端（Nginx）：`http://服务器IP`
- 后端健康检查（Nginx 反向代理）：`http://服务器IP/api/health`
- 后端文档（Nginx 反向代理）：`http://服务器IP/docs`

### 部署架构说明
- `frontend` 容器内置 Nginx，监听 `80` 端口并对外暴露。
- Nginx 将 `/api/*`、`/docs`、`/openapi.json` 反向代理到 `backend:8000`。
- 浏览器仅需访问服务器 `80` 端口，不需要直接暴露后端端口。

### 常用运维命令
```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f frontend
docker compose logs -f backend

# 重启服务
docker compose restart

# 停止服务
docker compose down
```
