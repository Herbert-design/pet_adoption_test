import { Menu, Edit, ChevronRight, Heart, History, ShieldAlert, Settings, Sparkles, LogOut, UserCircle2, Loader2, Check, X } from 'lucide-react';
import { BottomNavBar } from '@/src/components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getApplicationsList, getFavoritesList, AdoptionApplication, getMyProfile, updateMyProfile, Profile } from '@/src/types';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { authenticated, logout, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Edit logic
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const loadProfileData = async () => {
        setLoading(true);
        try {
          const [prof, apps, favs] = await Promise.all([
            getMyProfile(),
            getApplicationsList(),
            getFavoritesList()
          ]);
          setProfile(prof);
          setNewNickname(prof?.nickname || '');
          setApplications(apps);
          setFavorites(favs);
        } catch (error) {
          console.error('Failed to load profile data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadProfileData();
    }
  }, [authenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/welcome');
  };

  const handleUpdateProfile = async () => {
    if (!newNickname.trim() || newNickname === profile?.nickname) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    try {
      await updateMyProfile({ nickname: newNickname });
      setProfile(prev => prev ? { ...prev, nickname: newNickname } : null);
      setIsEditing(false);
    } catch (error) {
      alert('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="bg-surface text-on-surface min-h-screen pb-32">
        <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 z-50 bg-surface/80 backdrop-blur-xl">
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">宠愈 Sanctuary</h1>
        </header>

        <main className="pt-32 px-6 max-w-2xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center shadow-inner">
            <UserCircle2 className="text-on-surface-variant/30" size={64} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">您尚未登录</h2>
            <p className="text-on-surface-variant max-w-xs">登录后即可查看您的领养申请、收藏的毛孩子以及浏览历史。</p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="w-full h-16 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            立即登录
          </button>
          <button 
            onClick={() => navigate('/')}
            className="text-primary font-bold hover:underline"
          >
            先随便看看
          </button>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-outline-variant/5">
        <div className="flex items-center gap-4">
          <Menu className="text-primary cursor-pointer" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">宠愈 Sanctuary</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <section className="mb-12 relative">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(34,26,19,0.12)] border-2 border-white bg-surface-container">
                {profile?.avatar_url ? (
                  <img 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                    src={profile.avatar_url}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle2 className="w-full h-full text-on-surface-variant/20" />
                )}
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary to-primary-container p-2.5 rounded-full text-white shadow-lg border-2 border-white hover:scale-110 transition-transform"
              >
                <Edit size={14} />
              </button>
            </div>
            
            <div className="space-y-1 w-full flex flex-col items-center">
              {isEditing ? (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <input 
                    autoFocus
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="text-2xl font-bold tracking-tight text-on-surface bg-surface-container-high px-4 py-1 rounded-lg border-none focus:ring-2 focus:ring-primary w-48 text-center"
                    placeholder="输入新昵称"
                  />
                  <div className="flex flex-col gap-1">
                     <button 
                      disabled={saving}
                      onClick={handleUpdateProfile}
                      className="p-1.5 bg-primary text-white rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setNewNickname(profile?.nickname || '');
                      }}
                      className="p-1.5 bg-surface-container-highest text-on-surface rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <h2 className="text-3xl font-bold tracking-tight text-on-surface flex items-center gap-2">
                  {profile?.nickname || '铲屎官'}
                </h2>
              )}
              <p className="text-on-surface-variant text-sm font-medium tracking-wide">
                {loading ? '更新中...' : `陪伴了 ${applications.length} 只毛孩子找到新家`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { label: '收藏', value: favorites.length, path: '/adopt' },
              { label: '申请中', value: applications.length, path: '/applications' },
              { label: '消息', value: '0', path: '/profile' },
            ].map((stat) => (
              <div 
                key={stat.label} 
                onClick={() => navigate(stat.path)}
                className="bg-surface-container-low p-5 rounded-2xl flex flex-col items-center justify-center space-y-1 cursor-pointer hover:bg-surface-container hover:shadow-sm transition-all border border-outline-variant/10"
              >
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-bold text-on-surface">最近申请</h3>
              <span 
                onClick={() => navigate('/applications')}
                className="text-sm text-primary font-bold cursor-pointer hover:underline"
              >
                查看全部
              </span>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="h-24 flex items-center justify-center bg-surface-container-lowest rounded-xl">
                  <Loader2 className="animate-spin text-primary/30" size={24} />
                </div>
              ) : applications.length > 0 ? (
                applications.slice(0, 1).map(app => {
                  const pet = app.pet;
                  return (
                    <div 
                      key={app.id}
                      onClick={() => navigate('/applications')}
                      className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 group hover:bg-surface-container-high transition-all cursor-pointer border border-outline-variant/5 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img 
                          alt={pet?.name} 
                          className="w-full h-full object-cover" 
                          src={pet?.image}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-on-surface truncate">{pet?.name || '未知伙伴'}</h4>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold",
                            app.status === 'pending' ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"
                          )}>
                            {app.status === 'pending' ? '审核中' : app.status}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">提交时间：{app.date}</p>
                      </div>
                      <ChevronRight className="text-outline-variant group-hover:text-primary transition-colors flex-shrink-0" size={20} />
                    </div>
                  );
                })
              ) : (
                <div className="bg-surface-container-lowest p-8 rounded-xl text-center border border-dashed border-outline-variant/30">
                  <p className="text-sm text-on-surface-variant">暂无申请记录</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
            <div className="divide-y divide-outline-variant/5">
              {[
                { icon: Heart, label: '我的收藏', extra: `${favorites.length} 只毛孩子`, color: 'text-primary', bg: 'bg-primary/10', path: '/adopt' },
                { icon: History, label: '浏览历史', color: 'text-secondary', bg: 'bg-secondary/10', path: '/profile' },
                { icon: ShieldAlert, label: '回访报告', color: 'text-tertiary', bg: 'bg-tertiary/10', path: '/profile' },
                { icon: Settings, label: '设置', color: 'text-on-surface-variant', bg: 'bg-surface-container-highest', path: '/profile' },
                { icon: LogOut, label: '退出登录', color: 'text-error', bg: 'bg-error/10', path: 'logout' },
              ].map((item) => (
                <div 
                  key={item.label} 
                  onClick={() => {
                    if (item.path === 'logout') handleLogout();
                    else navigate(item.path);
                  }}
                  className="flex items-center justify-between p-5 hover:bg-surface-container transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                      <item.icon className={item.color} size={20} />
                    </div>
                    <span className="font-bold text-on-surface">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.extra && <span className="text-sm text-on-surface-variant">{item.extra}</span>}
                    <ChevronRight className="text-outline-variant group-hover:text-primary transition-colors" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-secondary/90 to-secondary-container p-8 rounded-3xl text-white flex justify-between items-center relative overflow-hidden shadow-2xl shadow-secondary/20">
            <div className="relative z-10 w-2/3">
              <h4 className="text-xl font-bold tracking-tight">成为志愿者</h4>
              <p className="text-sm opacity-80 mt-2 leading-relaxed">一起为流浪动物搭建温暖的港湾，见证生命的美好奇迹。</p>
              <button className="mt-6 bg-white text-secondary px-8 py-3 rounded-full text-xs font-black shadow-lg hover:bg-opacity-90 active:scale-95 transition-all uppercase tracking-widest">
                立即加入
              </button>
            </div>
            <div className="absolute right-[-10%] bottom-[-20%] opacity-20 rotate-12">
              <Sparkles size={160} />
            </div>
          </section>

          <div className="flex justify-center pt-8">
            <p className="text-[10px] text-outline-variant font-black tracking-[0.2em] uppercase opacity-50">Pet Sanctuary FullStack v3.1</p>
          </div>
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
}
