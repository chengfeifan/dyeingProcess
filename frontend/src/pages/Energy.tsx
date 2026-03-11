import { useState } from 'react';
import { Zap, Droplets, Flame, TrendingDown, Download, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '周一', water: 4000, electricity: 2400, steam: 2400 },
  { name: '周二', water: 3000, electricity: 1398, steam: 2210 },
  { name: '周三', water: 2000, electricity: 9800, steam: 2290 },
  { name: '周四', water: 2780, electricity: 3908, steam: 2000 },
  { name: '周五', water: 1890, electricity: 4800, steam: 2181 },
  { name: '周六', water: 2390, electricity: 3800, steam: 2500 },
  { name: '周日', water: 3490, electricity: 4300, steam: 2100 },
];

export default function Energy() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-amber-500" />
              <p className="text-sm text-slate-500 font-medium">本月用电量</p>
            </div>
            <p className="text-3xl font-bold text-slate-800">124,500 <span className="text-sm font-normal text-slate-500">kWh</span></p>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
              <TrendingDown size={14} /> 较上月下降 2.4%
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-amber-100 flex items-center justify-center">
            <span className="text-amber-500 font-bold">电</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={18} className="text-blue-500" />
              <p className="text-sm text-slate-500 font-medium">本月用水量</p>
            </div>
            <p className="text-3xl font-bold text-slate-800">45,200 <span className="text-sm font-normal text-slate-500">吨</span></p>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
              <TrendingDown size={14} /> 较上月下降 5.1%
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
            <span className="text-blue-500 font-bold">水</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={18} className="text-rose-500" />
              <p className="text-sm text-slate-500 font-medium">本月用汽量</p>
            </div>
            <p className="text-3xl font-bold text-slate-800">8,900 <span className="text-sm font-normal text-slate-500">吨</span></p>
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-2 font-medium">
              <TrendingDown className="rotate-180" size={14} /> 较上月上升 1.2%
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-rose-100 flex items-center justify-center">
            <span className="text-rose-500 font-bold">汽</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-slate-800">能耗趋势分析</h2>
            <div className="flex gap-2">
              <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
                <option>本周</option>
                <option>本月</option>
                <option>本年</option>
              </select>
              <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100">
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="water" name="水耗 (吨)" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="electricity" name="电耗 (kWh)" stackId="a" fill="#f59e0b" />
                <Bar dataKey="steam" name="蒸汽 (吨)" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Lightbulb size={20} />
            </div>
            <h2 className="font-semibold text-emerald-900">AI 节能建议</h2>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="bg-white/80 p-4 rounded-lg border border-emerald-100/50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-800 text-sm">优化洗涤次数</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">高优先级</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                分析显示 ORD-1001 批次（纯棉藏青色）当前采用 4 次水洗。根据历史数据与色牢度预测模型，减少至 3 次水洗仍可达到质量标准。
              </p>
              <div className="flex justify-between items-center text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded">
                <span>预计节水: 12 吨/批次</span>
                <button className="text-primary-600 hover:underline">应用建议</button>
              </div>
            </div>

            <div className="bg-white/80 p-4 rounded-lg border border-emerald-100/50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-800 text-sm">调整烘干温度曲线</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">中优先级</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                定型机 C1 当前设定温度 180°C 恒温。建议采用阶梯升温曲线（160°C -{'>'} 180°C），可降低热能损耗。
              </p>
              <div className="flex justify-between items-center text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded">
                <span>预计节电: 15%</span>
                <button className="text-primary-600 hover:underline">查看详情</button>
              </div>
            </div>
            
            <div className="bg-white/80 p-4 rounded-lg border border-emerald-100/50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-800 text-sm">错峰用电排产</h3>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">常规</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                将 3 个非加急订单（ORD-1004, ORD-1007, ORD-1008）的耗电高峰工序（如烘干、定型）调整至夜间谷电时段。
              </p>
              <div className="flex justify-between items-center text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded">
                <span>预计节省成本: ¥450</span>
                <button className="text-primary-600 hover:underline">调整排产</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
