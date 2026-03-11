import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, FileText, Eye } from 'lucide-react';

export default function Quality() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索批次号、订单号..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none w-64"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={16} /> 筛选
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <FileText size={16} /> 导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Quality List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">在线色差检测记录</h2>
            <span className="text-sm text-slate-500">共 45 条记录</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">批次号</th>
                  <th className="px-4 py-3 font-medium">订单号</th>
                  <th className="px-4 py-3 font-medium">目标颜色</th>
                  <th className="px-4 py-3 font-medium">ΔE (色差值)</th>
                  <th className="px-4 py-3 font-medium">检测结果</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { batch: 'B-231001', order: 'ORD-1001', color: '藏青色', deltaE: 0.45, status: 'pass' },
                  { batch: 'B-231002', order: 'ORD-1002', color: '大红色', deltaE: 1.25, status: 'warning' },
                  { batch: 'B-231003', order: 'ORD-1003', color: '宝蓝色', deltaE: 0.32, status: 'pass' },
                  { batch: 'B-231004', order: 'ORD-1004', color: '浅灰色', deltaE: 2.10, status: 'fail' },
                  { batch: 'B-231005', order: 'ORD-1005', color: '墨绿色', deltaE: 0.68, status: 'pass' },
                  { batch: 'B-231006', order: 'ORD-1006', color: '纯白色', deltaE: 0.21, status: 'pass' },
                  { batch: 'B-231007', order: 'ORD-1007', color: '卡其色', deltaE: 0.85, status: 'pass' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.batch}</td>
                    <td className="px-4 py-3 text-slate-600">{row.order}</td>
                    <td className="px-4 py-3 text-slate-600 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: row.color === '藏青色' ? '#000080' : row.color === '大红色' ? '#FF0000' : row.color === '宝蓝色' ? '#4169E1' : row.color === '浅灰色' ? '#D3D3D3' : row.color === '墨绿色' ? '#006400' : row.color === '纯白色' ? '#FFFFFF' : '#C3B091' }}></div>
                      {row.color}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">{row.deltaE.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {row.status === 'pass' && <CheckCircle size={16} className="text-emerald-500" />}
                        {row.status === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
                        {row.status === 'fail' && <XCircle size={16} className="text-rose-500" />}
                        <span className={`text-xs font-medium ${
                          row.status === 'pass' ? 'text-emerald-700' : 
                          row.status === 'warning' ? 'text-amber-700' : 
                          'text-rose-700'
                        }`}>
                          {row.status === 'pass' ? '合格' : row.status === 'warning' ? '轻微偏差' : '不合格'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary-600 hover:text-primary-800 p-1 rounded hover:bg-primary-50 transition-colors" title="查看详情">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Analysis & Traceability */}
        <div className="flex flex-col gap-6">
          {/* Defect Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">异常批次分析 (B-231004)</h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                <div className="flex items-center gap-2 text-rose-700 font-medium mb-1">
                  <XCircle size={16} />
                  <span>色差超标 (ΔE = 2.10)</span>
                </div>
                <p className="text-xs text-rose-600/80">标准要求: ΔE ≤ 1.0</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">AI 根因分析</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2 text-sm">
                    <span className="text-amber-500 font-bold">95%</span>
                    <span className="text-slate-600">染色机 B1 在 10:45 出现温度波动 (下降 5°C)，导致保温时间不足。</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <span className="text-slate-400 font-bold">12%</span>
                    <span className="text-slate-600">染料批次 (Lot-882) 浓度可能偏低。</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-medium text-slate-700 mb-2">处理建议</h3>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
                    生成返修配方
                  </button>
                  <button className="flex-1 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                    降级处理
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Traceability Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex-1 flex flex-col">
            <h2 className="font-semibold text-slate-800 mb-4">质量追溯 (B-231001)</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                  <div className="pl-4">
                    <h3 className="text-sm font-semibold text-slate-800">成品检验合格</h3>
                    <p className="text-xs text-slate-500 mt-0.5">2023-10-25 14:30 | 质检员: 张三</p>
                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600 border border-slate-100">
                      色牢度: 4-5级 | 缩水率: 2.5% | 克重: 305g/m²
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-sm"></div>
                  <div className="pl-4">
                    <h3 className="text-sm font-semibold text-slate-800">定型完成</h3>
                    <p className="text-xs text-slate-500 mt-0.5">2023-10-25 11:15 | 设备: 定型机 C1</p>
                    <p className="text-xs text-slate-600 mt-1">温度: 180°C | 车速: 20m/min</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-sm"></div>
                  <div className="pl-4">
                    <h3 className="text-sm font-semibold text-slate-800">染色完成</h3>
                    <p className="text-xs text-slate-500 mt-0.5">2023-10-25 09:40 | 设备: 染色机 A1</p>
                    <p className="text-xs text-slate-600 mt-1">配方: F-1001 | 浴比: 1:8</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow-sm"></div>
                  <div className="pl-4">
                    <h3 className="text-sm font-semibold text-slate-800">原料入库</h3>
                    <p className="text-xs text-slate-500 mt-0.5">2023-10-24 16:00 | 供应商: 某纺织厂</p>
                    <p className="text-xs text-slate-600 mt-1">批号: Y-8890 | 数量: 300kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
