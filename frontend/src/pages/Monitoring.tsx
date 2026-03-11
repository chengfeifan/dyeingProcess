import { useState } from 'react';
import { Activity, AlertCircle, Thermometer, Droplets, Wind, Settings2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10:00', temp: 60, pressure: 1.2 },
  { time: '10:10', temp: 65, pressure: 1.3 },
  { time: '10:20', temp: 75, pressure: 1.5 },
  { time: '10:30', temp: 85, pressure: 1.8 },
  { time: '10:40', temp: 95, pressure: 2.1 },
  { time: '10:50', temp: 100, pressure: 2.3 },
  { time: '11:00', temp: 100, pressure: 2.3 },
];

export default function Monitoring() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">运行设备</p>
            <p className="text-2xl font-bold text-slate-800">24/30</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <Activity size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">异常告警</p>
            <p className="text-2xl font-bold text-rose-600">2</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">平均温度</p>
            <p className="text-2xl font-bold text-slate-800">85°C</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
            <Thermometer size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">水耗流速</p>
            <p className="text-2xl font-bold text-slate-800">12m³/h</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Droplets size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Machine List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">设备状态</h2>
            <button className="text-slate-500 hover:text-slate-700"><Settings2 size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {[
              { id: 'M-01', name: '高温高压染色机 A1', status: 'running', temp: '100°C', order: 'ORD-1001' },
              { id: 'M-02', name: '高温高压染色机 A2', status: 'warning', temp: '135°C', order: 'ORD-1002' },
              { id: 'M-03', name: '常温染色机 B1', status: 'running', temp: '60°C', order: 'ORD-1003' },
              { id: 'M-04', name: '定型机 C1', status: 'idle', temp: '25°C', order: '--' },
              { id: 'M-05', name: '烘干机 D1', status: 'running', temp: '120°C', order: 'ORD-1005' },
            ].map((machine) => (
              <div 
                key={machine.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  machine.status === 'warning' ? 'border-rose-200 bg-rose-50/30' : 
                  machine.id === 'M-01' ? 'border-primary-500 bg-primary-50/30' : 'border-slate-100 hover:border-primary-200'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-800">{machine.name}</span>
                  <span className="text-xs text-slate-500">{machine.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      machine.status === 'running' ? 'bg-emerald-500' : 
                      machine.status === 'warning' ? 'bg-rose-500' : 'bg-slate-300'
                    }`}></span>
                    <span className={
                      machine.status === 'running' ? 'text-emerald-700' : 
                      machine.status === 'warning' ? 'text-rose-700' : 'text-slate-500'
                    }>
                      {machine.status === 'running' ? '运行中' : machine.status === 'warning' ? '温度异常' : '空闲'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-700">{machine.temp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Details & Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-slate-800">M-01 高温高压染色机 A1</h2>
                <p className="text-xs text-slate-500 mt-1">当前订单: ORD-1001 | 阶段: 保温</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 正常运行
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                  <Thermometer className="text-orange-500 mb-2" size={24} />
                  <p className="text-sm text-slate-500">实时温度</p>
                  <p className="text-2xl font-bold text-slate-800 font-mono">100.2 °C</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                  <Wind className="text-blue-500 mb-2" size={24} />
                  <p className="text-sm text-slate-500">实时压力</p>
                  <p className="text-2xl font-bold text-slate-800 font-mono">2.3 bar</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                  <Droplets className="text-cyan-500 mb-2" size={24} />
                  <p className="text-sm text-slate-500">浴比</p>
                  <p className="text-2xl font-bold text-slate-800 font-mono">1:8</p>
                </div>
              </div>

              <div className="flex-1 min-h-[200px]">
                <h3 className="text-sm font-medium text-slate-700 mb-4">温度与压力趋势</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="温度 (°C)" />
                    <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="压力 (bar)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
