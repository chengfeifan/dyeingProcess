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

## 一键部署（Docker）
```bash
./scripts/deploy.sh
```

部署后访问：
- 前端：http://localhost:3000
- 后端文档：http://localhost:8000/docs
