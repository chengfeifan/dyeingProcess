import { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  FlaskConical, 
  Activity, 
  Zap, 
  CheckCircle, 
  Wrench, 
  BarChart3, 
  Settings,
  Menu,
  Bell,
  User,
  Search,
  Palette,
  LogOut
} from 'lucide-react';
import Scheduling from './pages/Scheduling';
import Formula from './pages/Formula';
import Monitoring from './pages/Monitoring';
import Energy from './pages/Energy';
import Quality from './pages/Quality';
import Equipment from './pages/Equipment';
import Analytics from './pages/Analytics';
import System from './pages/System';
import Login from './pages/Login';

const MODULES = [
  { id: 'scheduling', name: '智能排产与调度', icon: CalendarClock, component: Scheduling },
  { id: 'formula', name: '智能配方管理', icon: FlaskConical, component: Formula },
  { id: 'monitoring', name: '生产过程监控', icon: Activity, component: Monitoring },
  { id: 'energy', name: '能耗管理与优化', icon: Zap, component: Energy },
  { id: 'quality', name: '质量管理', icon: CheckCircle, component: Quality },
  { id: 'equipment', name: '设备与预测维护', icon: Wrench, component: Equipment },
  { id: 'analytics', name: '数据分析与报表', icon: BarChart3, component: Analytics },
  { id: 'system', name: '系统管理', icon: Settings, component: System },
];

const THEMES = [
  { id: 'blue', name: '科技蓝', color: 'bg-blue-500' },
  { id: 'emerald', name: '环保绿', color: 'bg-emerald-500' },
  { id: 'indigo', name: '深邃紫', color: 'bg-indigo-500' },
  { id: 'rose', name: '玫瑰红', color: 'bg-rose-500' },
  { id: 'amber', name: '活力橙', color: 'bg-amber-500' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth-token') === 'mock-jwt-token';
  });

  const handleLogin = () => {
    localStorage.setItem('auth-token', 'mock-jwt-token');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
  };

  const [activeModule, setActiveModule] = useState(MODULES[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme || 'blue';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const ActiveComponent = MODULES.find(m => m.id === activeModule)?.component || Scheduling;
  const activeModuleName = MODULES.find(m => m.id === activeModule)?.name;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 font-bold text-white text-lg tracking-wide">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                <Activity size={20} />
              </div>
              <span>方舟智造</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <li key={module.id}>
                  <button
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-md' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                    title={module.name}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                    {sidebarOpen && (
                      <span className="text-sm font-medium whitespace-nowrap">
                        {module.name}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              <User size={16} />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-white">Admin User</span>
                <span className="text-xs text-slate-500">厂长 / 管理员</span>
              </div>
            )}
            {sidebarOpen && (
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-white p-1 rounded"
                title="退出登录"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800">{activeModuleName}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none w-64"
              />
            </div>
            
            {/* Theme Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                title="主题设置"
              >
                <Palette size={20} />
              </button>
              
              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-sm font-semibold text-slate-800">系统主题色</h3>
                    </div>
                    <div className="p-2">
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            theme === t.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${t.color}`}></div>
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
