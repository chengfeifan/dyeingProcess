from datetime import datetime, timedelta
from typing import List, Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="方舟智造染整工业智能化系统后端",
    description="基于可行性方案的演示后端，提供排产、配方、能耗、质量与设备维护等接口。",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class KPI(BaseModel):
    name: str
    value: float
    unit: str
    trend: Literal["up", "down", "flat"]
    target: float


class ScheduleItem(BaseModel):
    order_id: str
    machine: str
    fabric: str
    color: str
    start_time: datetime
    end_time: datetime
    status: Literal["running", "queued", "completed"]


class RecipeRequest(BaseModel):
    fabric: str
    color: str
    fastness: Literal["A", "B", "C"] = "B"


class RecipeSuggestion(BaseModel):
    recipe_id: str
    dyestuff_ratio: str
    auxiliaries: List[str]
    temperature_curve: str
    expected_first_pass_rate: float
    expected_energy_kwh: float


class Alert(BaseModel):
    level: Literal["high", "medium", "low"]
    message: str
    source: str
    ts: datetime


def _now() -> datetime:
    return datetime.utcnow()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "timestamp": _now().isoformat()}


@app.get("/api/dashboard/kpis", response_model=List[KPI])
def get_kpis() -> List[KPI]:
    return [
        KPI(name="一次染整率", value=95.3, unit="%", trend="up", target=96),
        KPI(name="单位水耗", value=68.5, unit="L/kg", trend="down", target=65),
        KPI(name="单位电耗", value=1.82, unit="kWh/kg", trend="down", target=1.75),
        KPI(name="设备综合效率OEE", value=87.6, unit="%", trend="up", target=90),
    ]


@app.get("/api/schedule", response_model=List[ScheduleItem])
def get_schedule() -> List[ScheduleItem]:
    now = _now()
    return [
        ScheduleItem(order_id="ORD-24001", machine="DYE-01", fabric="棉针织", color="藏青", start_time=now, end_time=now + timedelta(hours=2), status="running"),
        ScheduleItem(order_id="ORD-24002", machine="DYE-03", fabric="涤棉", color="墨绿", start_time=now + timedelta(minutes=20), end_time=now + timedelta(hours=3), status="queued"),
        ScheduleItem(order_id="ORD-23995", machine="DYE-02", fabric="尼龙", color="酒红", start_time=now - timedelta(hours=4), end_time=now - timedelta(hours=1), status="completed"),
    ]


@app.post("/api/recipes/recommend", response_model=RecipeSuggestion)
def recommend_recipe(request: RecipeRequest) -> RecipeSuggestion:
    fastness_bonus = {"A": 1.2, "B": 0.8, "C": 0.2}[request.fastness]
    return RecipeSuggestion(
        recipe_id=f"RCP-{request.fabric[:2]}-{request.color[:2]}-{request.fastness}",
        dyestuff_ratio="活性染料:助剂:固色剂 = 6.0:1.8:0.9",
        auxiliaries=["匀染剂 1.2g/L", "渗透剂 0.8g/L", "固色剂 1.0g/L"],
        temperature_curve="40°C保温10min → 60°C升温20min → 80°C保温30min",
        expected_first_pass_rate=93.5 + fastness_bonus,
        expected_energy_kwh=510.0 - (fastness_bonus * 5),
    )


@app.get("/api/alerts", response_model=List[Alert])
def get_alerts() -> List[Alert]:
    now = _now()
    return [
        Alert(level="high", message="DYE-03 染槽温度超过上限 2.5°C", source="生产监控", ts=now - timedelta(minutes=2)),
        Alert(level="medium", message="水处理回用率低于阈值 5%", source="能耗优化", ts=now - timedelta(minutes=12)),
        Alert(level="low", message="PUMP-08 建议72小时内维护", source="预测性维护", ts=now - timedelta(minutes=30)),
    ]


@app.get("/api/energy")
def get_energy() -> dict:
    return {
        "water_reuse_rate": 78.6,
        "steam_ton": 16.2,
        "electricity_kwh": 12450,
        "recommendations": ["将DYE-01升温段错峰至22:00后", "对DYE-03采用二段洗涤策略"]
    }


@app.get("/api/quality")
def get_quality() -> dict:
    return {
        "delta_e_avg": 0.84,
        "pass_rate": 97.1,
        "top_defects": ["色花", "缸差"],
    }


@app.get("/api/maintenance")
def get_maintenance() -> dict:
    return {
        "health_index": 91,
        "machines_need_check": ["PUMP-08", "DYE-05"],
        "predicted_failures_7d": 1,
    }
