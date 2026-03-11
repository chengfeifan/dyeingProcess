import { useState } from 'react';
import { Users, Shield, Database, Bell, Save, Key, UserPlus, Trash2, Settings, Download } from 'lucide-react';

export default function System() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Settings Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'users' ? 'border-primary-600 text-primary-600 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users size={18} /> 用户与权限
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'config' ? 'border-primary-600 text-primary-600 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings size={18} /> 系统配置
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'logs' ? 'border-primary-600 text-primary-600 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Database size={18} /> 运行日志
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'users' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">用户管理</h2>
                <p className="text-sm text-slate-500 mt-1">管理系统登录用户及角色权限分配。</p>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm">
                <UserPlus size={16} /> 添加用户
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">用户名</th>
                    <th className="px-4 py-3 font-medium">姓名</th>
                    <th className="px-4 py-3 font-medium">角色</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium">最后登录</th>
                    <th className="px-4 py-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { user: 'admin', name: '系统管理员', role: '超级管理员', status: 'active', lastLogin: '2023-10-25 08:30:12' },
                    { user: 'manager_li', name: '李厂长', role: '厂长', status: 'active', lastLogin: '2023-10-25 09:15:00' },
                    { user: 'tech_wang', name: '王工', role: '工艺员', status: 'active', lastLogin: '2023-10-24 16:45:22' },
                    { user: 'op_zhang', name: '张师傅', role: '操作工', status: 'active', lastLogin: '2023-10-25 07:50:11' },
                    { user: 'guest', name: '访客', role: '只读用户', status: 'disabled', lastLogin: '2023-09-10 10:00:00' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.user}</td>
                      <td className="px-4 py-3 text-slate-600">{row.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                          {row.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${row.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${row.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          {row.status === 'active' ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{row.lastLogin}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button className="text-primary-600 hover:text-primary-800 text-xs font-medium">编辑</button>
                        <button className="text-rose-600 hover:text-rose-800 text-xs font-medium">禁用</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">角色权限配置</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['厂长', '工艺员', '操作工'].map((role) => (
                  <div key={role} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                      <h3 className="font-medium text-slate-800 flex items-center gap-2"><Shield size={16} className="text-indigo-500" /> {role}</h3>
                      <button className="text-primary-600 hover:underline text-xs">修改</button>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <label className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded text-primary-600" /> 智能排产查看</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={role !== '操作工'} readOnly className="rounded text-primary-600" /> 配方修改与下发</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded text-primary-600" /> 生产过程监控</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={role === '厂长'} readOnly className="rounded text-primary-600" /> 系统配置管理</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">AI 模型参数设置</h2>
              <div className="space-y-4 bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-slate-800 text-sm">排产优化目标权重</h3>
                    <p className="text-xs text-slate-500 mt-0.5">调整排产算法偏向于交期优先还是能耗优先。</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">交期优先</span>
                    <input type="range" min="0" max="100" defaultValue="70" className="w-32" />
                    <span className="text-xs text-slate-500">能耗优先</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-slate-800 text-sm">配方推荐置信度阈值</h3>
                    <p className="text-xs text-slate-500 mt-0.5">低于此阈值的 AI 推荐配方将要求人工强制复核。</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue="85" className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center" />
                    <span className="text-sm text-slate-600">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">告警阈值配置</h2>
              <div className="space-y-4 bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">染色机温度偏差告警 (±°C)</label>
                    <input type="number" defaultValue="2.0" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">色差检测不合格阈值 (ΔE)</label>
                    <input type="number" defaultValue="1.0" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">设备健康度预警线</label>
                    <input type="number" defaultValue="70" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">能耗异常波动比例 (%)</label>
                    <input type="number" defaultValue="15" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                重置默认
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
                <Save size={16} /> 保存配置
              </button>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">系统运行日志</h2>
              <div className="flex gap-2">
                <input type="date" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600" />
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <Download size={14} /> 导出
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 h-[500px] overflow-y-auto">
              <div className="space-y-1">
                <p><span className="text-primary-400">[2023-10-25 10:15:22]</span> [INFO] System initialized successfully.</p>
                <p><span className="text-primary-400">[2023-10-25 10:15:25]</span> [INFO] MES synchronization completed. 12 new orders received.</p>
                <p><span className="text-primary-400">[2023-10-25 10:16:01]</span> [INFO] User 'tech_wang' logged in from 192.168.1.105.</p>
                <p><span className="text-emerald-400">[2023-10-25 10:18:33]</span> [AI_SCHEDULER] Optimization run completed in 1.2s. Schedule updated.</p>
                <p><span className="text-amber-400">[2023-10-25 10:22:15]</span> [WARN] Machine M-02 vibration sensor reading high (2.5mm/s).</p>
                <p><span className="text-primary-400">[2023-10-25 10:25:00]</span> [INFO] Formula F-1001 dispatched to Machine M-01.</p>
                <p><span className="text-rose-400">[2023-10-25 10:30:12]</span> [ERROR] Failed to connect to ERP database. Retrying in 30s...</p>
                <p><span className="text-primary-400">[2023-10-25 10:30:42]</span> [INFO] ERP database connection restored.</p>
                <p><span className="text-emerald-400">[2023-10-25 10:45:00]</span> [AI_PREDICT] Generated maintenance plan for M-02 (Confidence: 89%).</p>
                <p><span className="text-primary-400">[2023-10-25 11:00:00]</span> [INFO] Hourly energy consumption report generated.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
