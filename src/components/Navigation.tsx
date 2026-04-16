import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, Compass } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';

export function BottomNavBar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Compass, label: '发现', path: '/' },
    { icon: Search, label: '搜索', path: '/search' },
    { icon: Heart, label: '领养', path: '/adopt' },
    { icon: User, label: '我的', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 z-50 bg-surface/90 backdrop-blur-xl rounded-t-xl shadow-[0_-8px_24px_rgba(34,26,19,0.04)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 rounded-full",
              isActive 
                ? "bg-gradient-to-br from-primary to-primary-container text-white" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <item.icon size={24} className={isActive ? "fill-current" : ""} />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function TopAppBar({ title }: { title?: string }) {
  const { authenticated } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_12px_32px_rgba(34,26,19,0.06)]">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
          {title || "宠愈 Sanctuary"}
        </h1>
      </div>
      {authenticated ? (
        <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
          <img 
            alt="User Avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd7amYfa1IK1HpwnvG1gKBM27oRJDXHmHqotZDyBr_mJI0cvi3zz69iLGfsQVfVN97GBlhbEu7nOttHeqnvGZcGfTzRzbtK4emkCx6GV--P6EL2U-hxZqCNUSHCTOHXFRmKBJwvUqWpDYSphCYrhSKvc_9tNb_YddOggZ2YfC3zL4MpXYn2c6LJhksicb70-U4qZgii47y7KhC8WL15Q0ZZqdUzJpCXEOYLfoqHWKe0c5LYQEFb5KIRoZv1pj9-c1FiwiwuGuon8o"
            referrerPolicy="no-referrer"
          />
        </Link>
      ) : (
        <Link to="/login" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <User size={20} />
        </Link>
      )}
    </header>
  );
}
