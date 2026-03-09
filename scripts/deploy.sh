#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/3] Build and start containers..."
docker compose up -d --build

echo "[2/3] Service status"
docker compose ps

echo "[3/3] Done"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000/docs"
