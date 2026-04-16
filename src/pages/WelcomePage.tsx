import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  const handleStart = (path: string) => {
    localStorage.setItem('onboarded', 'true');
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 space-y-8 max-w-md"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl shadow-2xl shadow-primary/20 mb-4">
          <Heart className="text-white" size={40} fill="currentColor" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold tracking-tight text-on-surface">
            宠愈 <span className="text-primary">Sanctuary</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            每一个生命都值得被温柔以待。<br />
            在这里，开启您与毛孩子的命中注定。
          </p>
        </div>

        <div className="pt-8 space-y-4">
          <button
            onClick={() => handleStart('/login')}
            className="w-full h-16 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group hover:scale-[1.02] transition-all cursor-pointer"
          >
            立即开启
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleStart('/')}
            className="w-full h-16 bg-surface-container-high text-on-surface rounded-full font-bold text-lg hover:bg-surface-container-highest transition-all cursor-pointer"
          >
            先随便看看
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-primary/60 pt-4">
          <Sparkles size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">Healing Hearts, One Paw at a Time</span>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-10 text-primary/10"
      >
        <Heart size={120} fill="currentColor" />
      </motion.div>
    </div>
  );
}
