import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye,
  AlertCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { AdoptionApplication, getApplicationsList, supabase } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ApplicationManager() {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AdoptionApplication | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const data = await getApplicationsList();
    setApplications(data);
    setLoading(false);
  };

  const handleApprove = async (app: AdoptionApplication) => {
    if (!confirm(`确定要通过 ${app.details?.fullName} 的领养申请吗？这将使宠物 "${app.pet?.name}" 下线。`)) return;
    
    setProcessingId(app.id);
    try {
      // 1. Update Application status
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', app.id);
      if (appError) throw appError;

      // 2. Update Pet status to 'adopted' (Hide from app)
      const { error: petError } = await supabase
        .from('pets')
        .update({ status: 'adopted' })
        .eq('id', app.petId);
      if (petError) throw petError;

      // 3. Send in-app notification to user
      const { data: { user } } = await supabase.auth.getUser(); // This is the admin, but we need the applicant's ID
      // Wait, we need the user_id from the application. We should have it.
      // Fetching the application's user_id if not present
      const { data: fullAppData } = await supabase
        .from('applications')
        .select('user_id')
        .eq('id', app.id)
        .single();

      if (fullAppData) {
        await supabase
          .from('notifications')
          .insert({
            user_id: fullAppData.user_id,
            message: `🎉 恭喜！您对 "${app.pet?.name}" 的领养申请已通过！请留意后续联系。`,
            type: 'success'
          });
      }

      alert('审批成功！已通知用户，宠物已下线。');
      loadApplications();
      setSelectedApp(null);
    } catch (error) {
      console.error('Approval failed:', error);
      alert('审批操作失败');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (app: AdoptionApplication) => {
    if (!confirm('确定要拒绝该申请吗？')) return;
    
    setProcessingId(app.id);
    try {
      await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', app.id);

      const { data: fullAppData } = await supabase
        .from('applications')
        .select('user_id')
        .eq('id', app.id)
        .single();

      if (fullAppData) {
        await supabase
          .from('notifications')
          .insert({
            user_id: fullAppData.user_id,
            message: `抱歉，您对 "${app.pet?.name}" 的领养申请暂未通过。感谢您的支持。`,
            type: 'info'
          });
      }

      alert('申请已拒绝');
      loadApplications();
      setSelectedApp(null);
    } catch (error) {
       console.error('Rejection failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant overflow-hidden">
            <div className="p-8 border-b border-outline-variant bg-surface-container-high/30">
               <h3 className="text-xl font-bold flex items-center gap-2">
                 <ClipboardList className="text-primary" size={24} />
                 待审核申请 ({applications.filter(a => a.status === 'pending').length})
               </h3>
            </div>
            
            <div className="divide-y divide-outline-variant/30">
              {loading ? (
                [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-surface-container animate-pulse mx-4 my-2 rounded-2xl" />)
              ) : applications.length === 0 ? (
                <div className="py-20 text-center text-on-surface-variant flex flex-col items-center gap-3">
                   <Clock size={48} className="opacity-20" />
                   <p>暂无待处理的申请</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className={cn(
                      "p-6 flex items-center gap-6 cursor-pointer transition-all group",
                      selectedApp?.id === app.id ? "bg-primary/5" : "hover:bg-surface-container/50"
                    )}
                  >
                    <img src={app.pet?.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={app.pet?.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-lg">{app.details?.fullName}</span>
                        <span className="text-xs text-on-surface-variant">申请领养</span>
                        <span className="font-bold text-primary">{app.pet?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                         <span className="flex items-center gap-1"><Clock size={12}/> {app.date}</span>
                         <span className="flex items-center gap-1"><MapPin size={12}/> {app.pet?.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        app.status === 'pending' ? "bg-amber-100 text-amber-700 font-bold" :
                        app.status === 'approved' ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold leading-none" :
                        "bg-surface-container text-on-surface-variant font-medium"
                      )}>
                        {app.status === 'pending' ? '待审核' : 
                         app.status === 'approved' ? '已成功' : 
                         app.status === 'rejected' ? '已拒绝' : '审核中'}
                      </span>
                      <ChevronRight className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" size={20} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detail Section */}
        <div className="space-y-6 sticky top-28 h-fit">
          <AnimatePresence mode="wait">
            {selectedApp ? (
              <motion.div 
                key={selectedApp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant overflow-hidden shadow-xl"
              >
                <div className="h-32 bg-gradient-to-br from-primary to-primary-container relative">
                   <div className="absolute -bottom-10 left-8">
                      <img src={selectedApp.pet?.image} className="w-20 h-20 rounded-[1.5rem] border-4 border-surface shadow-lg object-cover" alt="" />
                   </div>
                </div>
                
                <div className="p-8 pt-14 space-y-8">
                  <div>
                    <h3 className="text-2xl font-black">{selectedApp.details?.fullName}</h3>
                    <p className="text-sm text-on-surface-variant">申请项目：领养 <span className="font-bold text-primary">{selectedApp.pet?.name}</span></p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><Phone size={18}/></div>
                       <div>
                         <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">联系电话</p>
                         <p className="font-bold text-sm">{selectedApp.details?.phone}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><Mail size={18}/></div>
                       <div>
                         <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">电子邮箱</p>
                         <p className="font-bold text-sm truncate max-w-[160px]">{selectedApp.details?.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><MapPin size={18}/></div>
                       <div>
                         <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">住房面积</p>
                         <p className="font-bold text-sm">{selectedApp.details?.homeArea} ㎡</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-black flex items-center gap-2">
                       <MessageSquare size={18} className="text-primary" />
                       领养初衷
                    </h4>
                    <div className="bg-surface-container p-5 rounded-3xl text-sm leading-relaxed text-on-surface-variant border border-outline-variant/30 italic">
                       "{selectedApp.details?.motivation}"
                    </div>
                  </div>

                  {selectedApp.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <button 
                        onClick={() => handleReject(selectedApp)}
                        className="h-14 rounded-full border-2 border-outline-variant text-on-surface-variant font-black text-sm hover:bg-error/5 hover:border-error/20 hover:text-error transition-all"
                      >
                        拒绝申请
                      </button>
                      <button 
                        onClick={() => handleApprove(selectedApp)}
                        className="h-14 rounded-full bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        disabled={processingId === selectedApp.id}
                      >
                        {processingId === selectedApp.id ? '处理中...' : (
                          <>
                            <CheckCircle2 size={18} />
                            通过审核
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-surface-container-low/50 border-2 border-dashed border-outline-variant/30 rounded-[2.5rem] p-12 text-center flex flex-col items-center gap-4 text-on-surface-variant">
                 <Eye size={48} className="opacity-10" />
                 <p className="text-sm">选择一个申请<br/>查看其详细评估报告</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

