import { useState, useEffect } from 'react';
import { 
  Users, 
  Dog, 
  Heart, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  PawPrint
} from 'lucide-react';
import { getAllPets, getApplicationsList, AdoptionApplication, Pet } from '../../types';
import { motion } from 'motion/react';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    totalApplications: 0,
    pendingApplications: 0,
    completedAdoptions: 0
  });
  const [recentApps, setRecentApps] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [pets, apps] = await Promise.all([
          getAllPets(true), // Include adopted
          getApplicationsList()
        ]);

        setStats({
          totalPets: pets.length,
          availablePets: pets.filter(p => p.status === 'available').length,
          totalApplications: apps.length,
          pendingApplications: apps.filter(a => a.status === 'pending').length,
          completedAdoptions: apps.filter(a => a.status === 'approved').length
        });
        setRecentApps(apps.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { label: '在册宠物', value: stats.totalPets, icon: PawPrint, color: 'text-primary', bg: 'bg-primary/10' },
    { label: '待领养', value: stats.availablePets, icon: Dog, color: 'text-tertiary', bg: 'bg-tertiary/10' },
    { label: '累计申请', value: stats.totalApplications, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50/50' },
    { label: '待审核人数', value: stats.pendingApplications, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/50' },
    { label: '成功领养', value: stats.completedAdoptions, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50/50' },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-surface-container rounded-3xl" />)}
      </div>
      <div className="h-[400px] bg-surface-container rounded-3xl" />
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant hover:border-primary/20 transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", card.bg, card.color)}>
              <card.icon size={24} />
            </div>
            <p className="text-on-surface-variant text-sm font-medium">{card.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-headline font-black">{card.value}</h3>
              <div className="flex items-center text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full mb-1">
                <TrendingUp size={10} className="mr-1" />
                +12%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-[2.5rem] border border-outline-variant overflow-hidden flex flex-col">
          <div className="p-8 border-b border-outline-variant flex items-center justify-between bg-surface-container-high/30">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <ClipboardList size={22} className="text-primary" />
              最近申请
            </h3>
            <Link to="/admin/applications" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              查看全部 <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">申请人</th>
                  <th className="px-8 py-4">领养对象</th>
                  <th className="px-8 py-4">日期</th>
                  <th className="px-8 py-4 text-right">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-high/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold">{app.details?.fullName}</div>
                      <div className="text-xs text-on-surface-variant">{app.details?.phone}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={app.pet?.image} alt={app.pet?.name} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-bold">{app.pet?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">{app.date}</td>
                    <td className="px-8 py-5 text-right">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        app.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        app.status === 'approved' ? "bg-tertiary-fixed text-on-tertiary-fixed" :
                        "bg-surface-container text-on-surface-variant"
                      )}>
                        {app.status === 'pending' ? '待审核' : 
                         app.status === 'approved' ? '已通过' : 
                         app.status === 'reviewing' ? '处理中' : '已拒绝'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Tips */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-black mb-2">管理贴士</h3>
               <p className="opacity-80 text-sm leading-relaxed mb-6">定期更新宠物的医疗状态可以显著提高领养申请的通过率和信任度。</p>
               <button className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 font-bold text-sm hover:bg-white/30 transition-all flex items-center gap-2">
                 查看指南 <ChevronRight size={16} />
               </button>
             </div>
             <PawPrint className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={160} />
           </div>

           <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant">
             <h3 className="font-bold mb-6 flex items-center gap-2">
               <CheckCircle2 size={18} className="text-tertiary" />
               快捷操作
             </h3>
             <div className="grid grid-cols-1 gap-3">
               <Link to="/admin/pets" className="p-4 bg-surface-container-high rounded-2xl flex items-center justify-between hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all">
                 <span className="font-bold text-sm">发布新宠物</span>
                 <Plus size={18} className="text-primary" />
               </Link>
               <div className="p-4 bg-surface-container-high rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
                 <span className="font-bold text-sm">群发站内信</span>
                 <Bell size={18} />
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Helpers missing icons
function ClipboardList({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
  );
}

function Plus({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}

function Bell({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}

import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

