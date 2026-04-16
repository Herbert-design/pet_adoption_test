import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dog, 
  ClipboardList, 
  LogOut, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, loading } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: '控制面板', path: '/admin' },
    { icon: Dog, label: '宠物管理', path: '/admin/pets' },
    { icon: ClipboardList, label: '领养申请', path: '/admin/applications' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Simple auth check - in a real app, we'd check for an 'admin' role
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-surface">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <ShieldCheck size={40} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">需要管理员权限</h2>
          <p className="text-on-surface-variant max-w-sm mt-2">只有经过授权的管理人员可以访问后台系统。请先登录。</p>
        </div>
        <button 
          onClick={() => (window.location.href = '/login')}
          className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-primary/20 transition-all"
        >
          前往登录
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-container-lowest font-sans text-on-surface">
      {/* Sidebar */}
      <aside className="w-72 bg-surface-container-low border-r border-outline-variant flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-headline font-black text-xl tracking-tight">宠愈·管理端</h1>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "stroke-[2.5px]" : "opacity-70 group-hover:opacity-100")} />
                <span className="font-bold flex-1">{item.label}</span>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant space-y-2 pb-8">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            <LogOut size={20} className="rotate-180" />
            <span className="font-medium">回到主页</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-surface-container-lowest min-h-screen overflow-y-auto">
        <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-xl font-headline font-bold">
              {menuItems.find(i => i.path === location.pathname)?.label || '概览'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">管理员账号</p>
              <p className="text-[10px] text-on-surface-variant">就职于救助中心</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User size={20} />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function User({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

