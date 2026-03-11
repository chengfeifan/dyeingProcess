import { useState } from 'react';
import { Search, Filter, Plus, FileText, Check, X, ArrowRight } from 'lucide-react';

export default function Formula() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索配方编号、颜色..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none w-64"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> 筛选
          </button>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm">
          <Plus size={16} /> 新建配方
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Formula List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-800">配方库</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">编号</th>
                  <th className="px-4 py-3 font-medium">颜色</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'F-1001', color: '藏青色', status: '已验证', active: true },
                  { id: 'F-1002', color: '大红色', status: '验证中', active: false },
                  { id: 'F-1003', color: '宝蓝色', status: '已验证', active: false },
                  { id: 'F-1004', color: '浅灰色', status: '草稿', active: false },
                  { id: 'F-1005', color: '墨绿色', status: '已验证', active: false },
                ].map((row) => (
                  <tr key={row.id} className={`hover:bg-slate-50 cursor-pointer ${row.active ? 'bg-primary-50/50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{row.id}</td>
                    <td className="px-4 py-3 text-slate-600 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color === '藏青色' ? '#000080' : row.color === '大红色' ? '#FF0000' : row.color === '宝蓝色' ? '#4169E1' : row.color === '浅灰色' ? '#D3D3D3' : '#006400' }}></div>
                      {row.color}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === '已验证' ? 'bg-emerald-100 text-emerald-700' : 
                        row.status === '验证中' ? 'bg-amber-100 text-amber-700' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula Details & AI Recommendation */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* AI Recommendation Panel */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">AI</span>
                  智能配方推荐
                </h2>
                <p className="text-sm text-indigo-700/80 mt-1">基于历史数据和数字孪生模型生成的优化配方</p>
              </div>
              <button className="px-3 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-md text-sm font-medium hover:bg-indigo-50">
                重新生成
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-lg p-3 border border-white">
                <p className="text-xs text-slate-500 mb-1">目标颜色</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-slate-200" style={{ backgroundColor: '#000080' }}></div>
                  <span className="font-medium text-slate-800">藏青色 (Navy Blue)</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-white">
                <p className="text-xs text-slate-500 mb-1">适用面料</p>
                <p className="font-medium text-slate-800">100% 纯棉针织布</p>
              </div>
            </div>
          </div>

          {/* Formula Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-800">配方详情 (F-1001)</h2>
              <div className="flex gap-2">
                <button className="text-slate-500 hover:text-slate-700 p-1"><FileText size={18} /></button>
              </div>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">染化料清单</h3>
              <table className="w-full text-sm mb-6">
                <thead className="text-slate-500 text-left">
                  <tr>
                    <th className="pb-2 font-medium">名称</th>
                    <th className="pb-2 font-medium">类型</th>
                    <th className="pb-2 font-medium text-right">用量 (g/L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 text-slate-800">活性深蓝 B-2GLN</td>
                    <td className="py-2 text-slate-500">主色染料</td>
                    <td className="py-2 text-right font-mono text-slate-800">2.50</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800">活性红 B-3BF</td>
                    <td className="py-2 text-slate-500">拼色染料</td>
                    <td className="py-2 text-right font-mono text-slate-800">0.45</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800">活性黄 B-4RFN</td>
                    <td className="py-2 text-slate-500">拼色染料</td>
                    <td className="py-2 text-right font-mono text-slate-800">0.12</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800">元明粉 (Na2SO4)</td>
                    <td className="py-2 text-slate-500">促染剂</td>
                    <td className="py-2 text-right font-mono text-slate-800">60.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800">纯碱 (Na2CO3)</td>
                    <td className="py-2 text-slate-500">固色剂</td>
                    <td className="py-2 text-right font-mono text-slate-800">20.00</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">工艺参数</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">染色温度</p>
                  <p className="font-semibold text-slate-800">60 °C</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">保温时间</p>
                  <p className="font-semibold text-slate-800">45 min</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">浴比</p>
                  <p className="font-semibold text-slate-800">1:8</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                虚拟验证
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                下发生产
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
