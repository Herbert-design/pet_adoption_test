import { ArrowLeft, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2, Home, MapPin, MessageSquare, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApplicationsList, AdoptionApplication } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const data = await getApplicationsList();
        setApplications(data);
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { label: '审核中', color: 'text-tertiary', bg: 'bg-tertiary/10', icon: Clock };
      case 'approved': return { label: '已通过', color: 'text-primary', bg: 'bg-primary/10', icon: CheckCircle2 };
      case 'rejected': return { label: '未通过', color: 'text-error', bg: 'bg-error/10', icon: XCircle };
      default: return { label: '处理中', color: 'text-on-surface-variant', bg: 'bg-surface-variant', icon: Clock };
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <nav className="fixed top-0 left-0 w-full flex items-center px-6 h-16 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <button 
          onClick={() => navigate('/profile')}
          className="p-2 hover:bg-surface-container rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-on-surface">我的申请进度</h1>
      </nav>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center shadow-inner">
              <Clock className="text-on-surface-variant/30" size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">暂无申请记录</h3>
              <p className="text-on-surface-variant">您还没有提交过任何领养申请，快去发现心仪的毛孩子吧。</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              去看看
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => {
              const pet = app.pet;
              const status = getStatusInfo(app.status);
              const isExpanded = expandedId === app.id;

              return (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden transition-all duration-300 shadow-sm",
                    isExpanded ? "ring-2 ring-primary/20 bg-surface-container shadow-md" : "hover:bg-surface-container-high"
                  )}
                >
                  <div 
                    onClick={() => toggleExpand(app.id)}
                    className="p-5 flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-black/5">
                      <img 
                        src={pet?.image} 
                        alt={pet?.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-on-surface truncate">
                          {pet?.name}
                        </h4>
                        <div className={cn("flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", status.bg, status.color)}>
                          <status.icon size={12} />
                          {status.label}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1"><Info size={12} /> {app.id.slice(0, 8).toUpperCase()}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {app.date}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-outline-variant" /> : <ChevronDown className="text-outline-variant" />}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-surface-container-highest/30"
                      >
                        <div className="px-6 pb-6 pt-2 space-y-6">
                          <div className="h-px bg-outline-variant/10 w-full"></div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">家庭面积</p>
                              <div className="flex items-center gap-2 text-on-surface">
                                <Home size={16} className="text-primary/60" />
                                <span className="font-bold">{app.details?.homeArea ? `${app.details.homeArea} ㎡` : '未填写'}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">居住人数</p>
                              <div className="flex items-center gap-2 text-on-surface">
                                <MapPin size={16} className="text-primary/60" />
                                <span className="font-bold">{app.details?.livingCount || '未填写'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">联系方式</p>
                            <p className="text-sm font-bold text-on-surface">{app.details?.fullName} · {app.details?.phone}</p>
                            <p className="text-xs text-on-surface-variant">{app.details?.email}</p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                              <Clock size={12} /> 领养进度追踪
                            </p>
                            <div className="flex justify-between items-start relative px-2">
                              {/* Connector Line */}
                              <div className="absolute top-4 left-4 right-4 h-0.5 bg-outline-variant/20 z-0"></div>
                              <div 
                                className="absolute top-4 left-4 h-0.5 bg-primary z-10 transition-all duration-500" 
                                style={{ 
                                  width: app.status === 'pending' ? '33%' : (app.status === 'approved' ? '100%' : '0%') 
                                }}
                              ></div>

                              {[
                                { label: '已提交', sub: '申请成功', active: true },
                                { label: '审核中', sub: '预计1-3天', active: app.status !== 'rejected' },
                                { label: '回访中', sub: '线下对接', active: app.status === 'approved' },
                                { label: '完成', sub: '正式领养', active: app.status === 'approved' }
                              ].map((step, i) => (
                                <div key={i} className="relative z-20 flex flex-col items-center gap-2">
                                  <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                                    step.active ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-surface border-outline-variant text-on-surface-variant"
                                  )}>
                                    {i + 1}
                                  </div>
                                  <div className="text-center">
                                    <p className={cn("text-[10px] font-bold", step.active ? "text-primary" : "text-on-surface-variant")}>{step.label}</p>
                                    <p className="text-[8px] text-on-surface-variant/60">{step.sub}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                              <MessageSquare size={12} /> 领养初衷
                            </p>
                            <div className="bg-surface-container-high/50 p-4 rounded-2xl italic text-sm text-on-surface-variant leading-relaxed border border-outline-variant/5">
                              “{app.details?.motivation || '没有填写特别说明'}”
                            </div>
                          </div>

                          <button 
                            onClick={() => navigate(`/pet/${app.petId}`)}
                            className="w-full py-3 bg-surface-container-high text-primary rounded-full text-xs font-bold hover:bg-primary hover:text-white transition-all border border-primary/20"
                          >
                            查看毛孩子详情
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
