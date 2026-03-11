import { useState } from 'react';
import { Wrench, Settings, AlertTriangle, Calendar, CheckCircle2, Search, Filter, Clock } from 'lucide-react';

export default function Equipment() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索设备名称、编号..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none w-64"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> 筛选状态
          </button>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm">
          <Wrench size={16} /> 新增维保工单
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Equipment List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">设备台账与状态监测</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={14} /> 正常 (24)</span>
              <span className="flex items-center gap-1 text-amber-600"><AlertTriangle size={14} /> 预警 (2)</span>
              <span className="flex items-center gap-1 text-slate-500"><Settings size={14} /> 维保中 (1)</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'M-01', name: '高温高压染色机 A1', type: '染色设备', status: 'normal', health: 92, nextMaint: '2023-11-15' },
                { id: 'M-02', name: '高温高压染色机 A2', type: '染色设备', status: 'warning', health: 65, nextMaint: '2023-10-28', alert: '主循环泵振动异常' },
                { id: 'M-03', name: '常温染色机 B1', type: '染色设备', status: 'normal', health: 88, nextMaint: '2023-11-20' },
                { id: 'M-04', name: '定型机 C1', type: '后整理设备', status: 'maintenance', health: 45, nextMaint: '正在维保' },
                { id: 'M-05', name: '烘干机 D1', type: '后整理设备', status: 'normal', health: 95, nextMaint: '2023-12-01' },
                { id: 'M-06', name: '全自动称料系统', type: '辅助设备', status: 'normal', health: 98, nextMaint: '2024-01-10' },
              ].map((eq) => (
                <div key={eq.id} className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  eq.status === 'warning' ? 'border-amber-200 bg-amber-50/30' : 
                  eq.status === 'maintenance' ? 'border-slate-200 bg-slate-50' : 
                  'border-slate-100 bg-white'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{eq.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{eq.id} | {eq.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      eq.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : 
                      eq.status === 'warning' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {eq.status === 'normal' ? '正常运行' : eq.status === 'warning' ? '需关注' : '维保中'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">健康指数 (AI评估)</span>
                        <span className={`font-medium ${eq.health < 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{eq.health}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${eq.health < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${eq.health}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {eq.alert && (
                      <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>{eq.alert}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100/50">
                      <Calendar size={14} />
                      <span>下次维保: {eq.nextMaint}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Maintenance Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-indigo-50 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center shadow-sm">
              <Clock size={16} />
            </div>
            <h2 className="font-semibold text-slate-800">AI 预测性维护计划</h2>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              基于设备运行数据、振动频率、温度曲线及历史故障记录，AI 模型自动生成的未来 7 天维护建议。
            </p>
            
            <div className="space-y-4">
              <div className="relative pl-4 border-l-2 border-amber-400">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-400"></div>
                <h3 className="text-sm font-semibold text-slate-800">M-02 主循环泵轴承更换</h3>
                <p className="text-xs text-amber-600 font-medium mt-0.5">建议执行: 2023-10-28 (3天内)</p>
                <div className="mt-2 text-xs text-slate-600 space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
                  <p><span className="text-slate-400">预测依据:</span> 连续 48 小时高频振动异常，偏离基准值 25%。</p>
                  <p><span className="text-slate-400">预计耗时:</span> 4 小时</p>
                  <p><span className="text-slate-400">所需备件:</span> SKF 6208 轴承 (库存: 2件)</p>
                </div>
                <button className="mt-2 text-xs text-primary-600 font-medium hover:underline">生成工单并调整排产</button>
              </div>

              <div className="relative pl-4 border-l-2 border-primary-400">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary-400"></div>
                <h3 className="text-sm font-semibold text-slate-800">M-05 烘干机滤网深度清洁</h3>
                <p className="text-xs text-primary-600 font-medium mt-0.5">建议执行: 2023-11-01</p>
                <div className="mt-2 text-xs text-slate-600 space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
                  <p><span className="text-slate-400">预测依据:</span> 风压压降趋势分析，预计 5 天后达到临界值，影响烘干效率。</p>
                  <p><span className="text-slate-400">预计耗时:</span> 1.5 小时</p>
                </div>
                <button className="mt-2 text-xs text-primary-600 font-medium hover:underline">加入常规维保计划</button>
              </div>
              
              <div className="relative pl-4 border-l-2 border-slate-300">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-300"></div>
                <h3 className="text-sm font-semibold text-slate-800">M-01 染液循环管道除垢</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">建议执行: 2023-11-15</p>
                <div className="mt-2 text-xs text-slate-600 space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
                  <p><span className="text-slate-400">预测依据:</span> 流量计数据衰减模型预测。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
