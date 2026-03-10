#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] Docker 未安装，请先安装 Docker。"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "[ERROR] Docker Compose 插件不可用，请安装 docker compose。"
  exit 1
fi

echo "[1/5] 拉取基础镜像（可选）..."
docker compose pull --ignore-pull-failures

echo "[2/5] 构建并启动服务..."
docker compose up -d --build

echo "[3/5] 等待服务就绪..."
for i in {1..20}; do
  if curl -fsS http://localhost/api/health >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "[4/5] 服务状态"
docker compose ps

echo "[5/5] 健康检查"
curl -fsS http://localhost/api/health && echo

SERVER_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
if [[ -z "${SERVER_IP}" ]]; then
  SERVER_IP="<服务器IP>"
fi

echo "部署完成，可通过 Nginx 访问："
echo "- 前端首页: http://${SERVER_IP}"
echo "- 后端健康检查: http://${SERVER_IP}/api/health"
echo "- 后端接口文档: http://${SERVER_IP}/docs"
