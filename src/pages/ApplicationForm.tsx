import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Home, Heart, HelpCircle, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Pet, getPetById, submitAdoptionApplication, checkIfAppliedForPet } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    homeArea: '',
    livingCount: '独自居住',
    motivation: '',
    agreed: false
  });

  useEffect(() => {
    if (id) {
      getPetById(id).then(setPet);
      
      // Safety check: if already applied, redirect to applications list
      checkIfAppliedForPet(id).then(applied => {
        if (applied) {
          alert('您已经提交过该毛孩子的领养申请了。');
          navigate('/applications', { replace: true });
        }
      });
    }
  }, [id, navigate]);

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.phone && formData.email;
    if (step === 2) return formData.homeArea && formData.motivation;
    if (step === 3) return formData.agreed;
    return true;
  };

  const handleNext = async () => {
    setError(null);
    if (step < 3) {
      if (!isStepValid()) {
        setError('请填写所有必填字段');
        return;
      }
      setStep(step + 1);
    }
    else {
      if (pet && formData.agreed) {
        setIsSubmitting(true);
        try {
          await submitAdoptionApplication({
            petId: pet.id,
            details: {
              ...formData,
              homeArea: Number(formData.homeArea) || 0
            }
          });
          setIsSubmitted(true);
        } catch (error) {
          console.error('Failed to submit application:', error);
          setError('提交失败，请检查网络并重试');
        } finally {
          setIsSubmitting(false);
        }
      } else if (!formData.agreed) {
        setError('请阅读并明确勾选同意领养协议');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-8 max-w-md"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
              <CheckCircle2 className="text-white" size={48} />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 text-primary"
            >
              <Sparkles size={24} />
            </motion.div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-headline font-bold text-on-surface">申请已提交！</h1>
            <p className="text-on-surface-variant leading-relaxed">
              您的领养申请已成功送达。我们的志愿者将在 3-5 个工作日内完成初步审核，请保持手机畅通。
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <button 
              onClick={() => navigate('/applications')}
              className="w-full h-16 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20"
            >
              查看申请进度
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full h-16 bg-surface-container-high text-on-surface rounded-full font-bold text-lg"
            >
              返回首页
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_12px_32px_rgba(34,26,19,0.06)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-surface-container rounded-full transition-colors"
          >
            <ArrowLeft className="text-primary" />
          </button>
          <span className="text-2xl font-bold tracking-tight text-primary">领养申请</span>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-4 font-headline">
            {step === 1 ? '基本信息' : step === 2 ? '居住环境' : '确认提交'}
          </h1>
          <p className="text-on-surface-variant leading-relaxed">
            {step === 1 
              ? '请填写您的真实联系方式，以便我们能及时通知您领养进度。'
              : step === 2 
                ? `感谢你选择领养${pet?.name || '毛孩子'}。我们将通过这份表单更好地了解您的居住环境。`
                : '请核对您的申请信息，确认无误后提交。'}
          </p>
        </header>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Step 0{step} / 03</span>
            <span className="text-xs font-bold text-on-surface-variant">
              {step === 1 ? '个人资料' : step === 2 ? '居住环境' : '最后确认'}
            </span>
          </div>
          <div className="h-3 w-full bg-secondary-fixed rounded-sm overflow-hidden flex gap-1">
            <div className={cn("h-full transition-all duration-500 rounded-sm", step >= 1 ? "bg-secondary w-1/3" : "bg-secondary-fixed w-0")}></div>
            <div className={cn("h-full transition-all duration-500 rounded-sm", step >= 2 ? "bg-secondary w-1/3" : "bg-secondary-fixed w-0")}></div>
            <div className={cn("h-full transition-all duration-500 rounded-sm", step >= 3 ? "bg-secondary w-1/3" : "bg-secondary-fixed w-0")}></div>
          </div>
        </div>

        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 text-error text-sm font-bold"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="p-6 bg-surface-container-high rounded-lg space-y-3 shadow-sm">
                <label className="block text-sm font-bold text-on-surface-variant tracking-wide">真实姓名</label>
                <input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-default focus:ring-2 focus:ring-primary h-12 px-4 transition-all" 
                  placeholder="请输入姓名" 
                />
              </div>
              <div className="p-6 bg-surface-container-high rounded-lg space-y-3 shadow-sm">
                <label className="block text-sm font-bold text-on-surface-variant tracking-wide">联系电话</label>
                <input 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-default focus:ring-2 focus:ring-primary h-12 px-4 transition-all" 
                  placeholder="请输入手机号" 
                />
              </div>
              <div className="p-6 bg-surface-container-high rounded-lg space-y-3 shadow-sm">
                <label className="block text-sm font-bold text-on-surface-variant tracking-wide">电子邮箱</label>
                <input 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-default focus:ring-2 focus:ring-primary h-12 px-4 transition-all" 
                  placeholder="请输入邮箱" 
                />
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="text-primary" fill="currentColor" size={24} />
                  <h2 className="text-xl font-bold">居住环境调查</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-surface-container-high rounded-lg space-y-3 shadow-sm">
                    <label className="block text-sm font-bold text-on-surface-variant tracking-wide">房屋面积 (㎡)</label>
                    <input 
                      value={formData.homeArea}
                      onChange={e => setFormData({...formData, homeArea: e.target.value})}
                      className="w-full bg-surface-container-lowest border-none rounded-default focus:ring-2 focus:ring-primary h-12 px-4 transition-all" 
                      placeholder="例如：85" 
                      type="number" 
                    />
                  </div>
                  <div className="p-6 bg-surface-container-high rounded-lg space-y-3 shadow-sm">
                    <label className="block text-sm font-bold text-on-surface-variant tracking-wide">居住人数</label>
                    <select 
                      value={formData.livingCount}
                      onChange={e => setFormData({...formData, livingCount: e.target.value})}
                      className="w-full bg-surface-container-lowest border-none rounded-default focus:ring-2 focus:ring-primary h-12 px-4 transition-all"
                    >
                      <option>独自居住</option>
                      <option>2人家庭</option>
                      <option>3-4人家庭</option>
                      <option>5人以上大家庭</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="text-primary" fill="currentColor" size={24} />
                  <h2 className="text-xl font-bold">领养初衷</h2>
                </div>
                <textarea 
                  value={formData.motivation}
                  onChange={e => setFormData({...formData, motivation: e.target.value})}
                  className="w-full bg-surface-container-high border-none rounded-lg p-6 focus:ring-2 focus:ring-primary transition-all text-on-surface shadow-sm" 
                  placeholder="告诉我们你为什么想领养这个毛孩子..." 
                  rows={5}
                ></textarea>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="p-6 bg-surface-container-low rounded-lg border border-outline-variant/15 shadow-sm">
                <h3 className="font-bold mb-4">领养承诺</h3>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-primary flex-shrink-0" /> 我承诺将为宠物提供充足的食物和清洁的饮水。</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-primary flex-shrink-0" /> 我承诺将定期为宠物接种疫苗并进行驱虫。</li>
                  <li className="flex gap-2"><CheckCircle2 size={16} className="text-primary flex-shrink-0" /> 我承诺不离不弃，即使生活发生变化也会妥善安置。</li>
                </ul>
              </div>
              <div className="flex items-center gap-3 p-4">
                <input 
                  checked={formData.agreed}
                  onChange={e => setFormData({...formData, agreed: e.target.checked})}
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary" 
                  id="agree" 
                />
                <label htmlFor="agree" className="text-sm font-medium">我已阅读并同意《领养协议》</label>
              </div>
            </motion.section>
          )}

          <footer className="pt-10 flex flex-col gap-4">
            <button 
              disabled={isSubmitting || !isStepValid()}
              onClick={handleNext}
              className={cn(
                "w-full h-16 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold text-lg shadow-[0_12px_32px_rgba(143,78,0,0.25)] active:scale-95 transition-all flex items-center justify-center",
                (isSubmitting || !isStepValid()) && "opacity-50 grayscale cursor-not-allowed"
              )} 
              type="button"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                step === 3 ? '确认提交' : '下一步'
              )}
            </button>
            {step < 3 && (
              <p className="text-center text-xs text-on-surface-variant px-8">
                提交申请即表示你同意《宠愈 Sanctuary 领养服务协议》及《隐私政策》。
              </p>
            )}
          </footer>
        </form>
      </main>

      <div className="fixed bottom-8 right-6">
        <button className="w-14 h-14 bg-tertiary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative">
          <HelpCircle size={24} />
          <div className="absolute right-16 bg-white py-2 px-4 rounded-lg shadow-xl text-xs font-bold text-tertiary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            需要填写建议？
          </div>
        </button>
      </div>
    </div>
  );
}
