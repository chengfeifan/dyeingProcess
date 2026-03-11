import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, Play, Pause, RefreshCw } from 'lucide-react';

export default function Scheduling() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">今日订单数</p>
            <p className="text-2xl font-bold text-slate-800">124</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">已完成排产</p>
            <p className="text-2xl font-bold text-slate-800">98</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">排队中订单</p>
            <p className="text-2xl font-bold text-slate-800">26</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">异常订单</p>
            <p className="text-2xl font-bold text-slate-800">3</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Order List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-semibold text-slate-800">待排产订单 (MES同步)</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              <RefreshCw size={14} /> 同步
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-3 mb-2 border border-slate-100 rounded-lg hover:border-primary-200 hover:bg-primary-50/50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-800 text-sm">ORD-202310{i}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${i === 1 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {i === 1 ? '加急' : '普通'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>面料: 纯棉针织布 (300kg)</p>
                  <p>颜色: 藏青色 (Navy Blue)</p>
                  <p>交期: 2023-10-2{i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Gantt Chart / Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-semibold text-slate-800">智能排程甘特图</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50">
                手动调整
              </button>
              <button className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 flex items-center gap-1">
                <Play size={14} /> 一键智能排产
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-x-auto">
            {/* Mock Gantt Chart */}
            <div className="min-w-[600px] h-full flex flex-col">
              <div className="flex border-b border-slate-200 pb-2 mb-4 text-xs text-slate-500">
                <div className="w-24 font-medium">设备</div>
                <div className="flex-1 flex justify-between px-4">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>00:00</span>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                {['染色机 A1', '染色机 A2', '染色机 B1', '定型机 C1', '烘干机 D1'].map((machine, idx) => (
                  <div key={machine} className="flex items-center h-10">
                    <div className="w-24 text-sm font-medium text-slate-700">{machine}</div>
                    <div className="flex-1 h-full bg-slate-50 rounded-md relative border border-slate-100">
                      {/* Mock scheduled blocks */}
                      <div 
                        className={`absolute top-1 bottom-1 rounded shadow-sm flex items-center justify-center text-xs text-white font-medium
                          ${idx % 2 === 0 ? 'bg-primary-500' : 'bg-indigo-500'}
                        `}
                        style={{ left: `${idx * 10}%`, width: `${20 + idx * 5}%` }}
                      >
                        ORD-202310{idx + 1}
                      </div>
                      {idx === 1 && (
                        <div 
                          className="absolute top-1 bottom-1 rounded shadow-sm flex items-center justify-center text-xs text-white font-medium bg-amber-500"
                          style={{ left: '50%', width: '30%' }}
                        >
                          ORD-2023106
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
