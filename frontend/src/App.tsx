import { useEffect, useMemo, useState } from 'react';

type KPI = { name: string; value: number; unit: string; trend: 'up' | 'down' | 'flat'; target: number };
type Alert = { level: 'high'|'medium'|'low'; message: string; source: string; ts: string };

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export function App() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/dashboard/kpis`).then(r => r.json()),
      fetch(`${API_BASE}/api/alerts`).then(r => r.json()),
      fetch(`${API_BASE}/api/recipes/recommend`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ fabric: '棉针织', color: '藏青', fastness: 'A' })
      }).then(r => r.json())
    ]).then(([k, a, rc]) => {
      setKpis(k); setAlerts(a); setRecipe(rc);
    });
  }, []);

  const levelColor = useMemo(() => ({ high: '#dc2626', medium: '#d97706', low: '#2563eb' }), [] as any);

  return (
    <main style={{fontFamily:'Arial, sans-serif', background:'#f5f7fb', minHeight:'100vh', padding:20}}>
      <h1>方舟智造染整工业智能化系统</h1>
      <p>智能排产、配方管理、生产监控、能耗管理、质量管理、预测维护</p>

      <section style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(150px,1fr))', gap:12, margin:'16px 0'}}>
        {kpis.map((k) => (
          <div key={k.name} style={{background:'#fff', borderRadius:8, padding:12, boxShadow:'0 1px 4px #d7dbe7'}}>
            <div style={{color:'#64748b', fontSize:12}}>{k.name}</div>
            <div style={{fontSize:24, fontWeight:700}}>{k.value}{k.unit}</div>
            <div style={{fontSize:12}}>目标 {k.target}{k.unit}</div>
          </div>
        ))}
      </section>

      {recipe && (
        <section style={{background:'#fff', borderRadius:8, padding:16, marginBottom:16}}>
          <h3>AI 配方推荐</h3>
          <div>配方编号：{recipe.recipe_id}</div>
          <div>染化料比例：{recipe.dyestuff_ratio}</div>
          <div>温度曲线：{recipe.temperature_curve}</div>
          <div>预计一次染整率：{recipe.expected_first_pass_rate}%</div>
        </section>
      )}

      <section style={{background:'#fff', borderRadius:8, padding:16}}>
        <h3>实时预警</h3>
        {alerts.map((a, idx) => (
          <div key={idx} style={{borderLeft:`4px solid ${levelColor[a.level]}`, padding:'8px 10px', marginBottom:8, background:'#f8fafc'}}>
            <strong>{a.source}</strong>：{a.message}
          </div>
        ))}
      </section>
    </main>
  );
}
