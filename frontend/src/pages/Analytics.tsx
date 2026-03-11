import { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, PieChart, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart as RechartsPieChart, Pie } from 'recharts';

const productionData = [
  { name: '10-01', output: 4000, target: 4500 },
  { name: '10-02', output: 3000, target: 4500 },
  { name: '10-03', output: 2000, target: 4500 },
  { name: '10-04', output: 2780, target: 4500 },
  { name: '10-05', output: 1890, target: 4500 },
  { name: '10-06', output: 2390, target: 4500 },
  { name: '10-07', output: 3490, target: 4500 },
];

const defectData = [
  { name: '色差', value: 400 },
  { name: '色花', value: 300 },
  { name: '折痕', value: 300 },
  { name: '污渍', value: 200 },
];
const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

export default function Analytics() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <BarChart3 size={24} className="text-primary-600" /> 综合数据分析
        </h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600">
            <Calendar size={16} />
            <span>2023-10-01 至 2023-10-07</span>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> 筛选
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm">
            <Download size={16} /> 导出报表
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">总产量 (吨)</p>
          <p className="text-3xl font-bold text-slate-800">19,550</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp size={14} /> <span>环比增长 5.2%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">一次合格率 (RFT)</p>
          <p className="text-3xl font-bold text-slate-800">94.5%</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp size={14} /> <span>环比提升 1.1%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">设备综合效率 (OEE)</p>
          <p className="text-3xl font-bold text-slate-800">78.2%</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp size={14} /> <span>环比提升 2.4%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">单位能耗成本 (元/吨)</p>
          <p className="text-3xl font-bold text-slate-800">452.5</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="rotate-180" size={14} /> <span>环比下降 3.8%</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col h-[350px]">
          <h2 className="font-semibold text-slate-800 mb-4">产量趋势与目标达成</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="output" name="实际产量" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOutput)" />
                <Area type="step" dataKey="target" name="目标产量" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col h-[350px]">
          <h2 className="font-semibold text-slate-800 mb-4">不良品根因分布 (AI分析)</h2>
          <div className="flex-1 w-full flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={defectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {defectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4 space-y-4">
              {defectData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">{item.value} 批次</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-primary-600">AI 洞察:</span> 色差问题主要集中在 B1 染色机，建议排查其温度控制系统稳定性。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
