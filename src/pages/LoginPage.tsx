import React, { useState } from 'react';
import { User, Lock, Eye, Mail, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) {
          if (loginError.message.includes('Email not confirmed')) {
            setError('您的邮箱尚未确认。请检查邮箱中的激活邮件，或在 Supabase 后台关闭“邮箱确认”选项。');
          } else {
            throw loginError;
          }
          return;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setSuccess('注册成功！注意：如果登录提示“Email not confirmed”，请去邮箱点击激活链接，或者在 Supabase 后台关闭“邮箱确认”选项。');
        setMode('login');
      }
      if (mode === 'login') navigate('/');
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Close Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 p-3 bg-surface-container-high rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-all z-50 shadow-lg"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(34,26,19,0.06)] relative z-10">
        <div className="hidden md:flex flex-col justify-center items-center bg-surface-container p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.7,-76.4C58.1,-69.2,69.5,-57.4,76.5,-43.8C83.5,-30.2,86.2,-15.1,84.3,-0.9C82.5,13.2,76.1,26.5,67.8,38.3C59.5,50.1,49.2,60.5,37,68.1C24.8,75.7,10.7,80.5,-3.6,86.7C-17.8,92.8,-32.2,100.3,-45.5,95.5C-58.8,90.6,-71,73.5,-78.4,56.6C-85.9,39.6,-88.7,22.8,-87.3,6.8C-85.8,-9.2,-80.1,-24.3,-71.4,-38.3C-62.7,-52.3,-51,-65.2,-37.2,-72.1C-23.4,-78.9,-7.4,-79.8,9.1,-95.5C25.6,-111.1,31.3,-83.6,44.7,-76.4Z" fill="#8F4E00" transform="translate(100 100)"></path>
            </svg>
          </div>
          <div className="relative z-10 text-center">
            <motion.img 
              initial={{ rotate: -3 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              alt="Adorable puppy" 
              className="w-80 h-80 object-cover rounded-xl shadow-lg mb-8" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCETbfefjTBcGJg1DF9jtfr1qT4sqb1J0Q31tNCwhnvwozypOwMVxEK4ZjcZ6-gP_ZGjqy6vETbODyXN7gV3c-bzgfo5NSlc3iLxrLibAtuml-lJPJTA0jYwOTQXhdifAKPRw2-JD0H-W58qGcmKwvWNTkK779tcB7T3EzeDH2bWnaRhP8nm73zxAnINpXRYKASlsVyqOOXdjitDCmPNuNnWeay6bDmGQvFW7yWy1F3dg9hxT6E4gYyV0h7oR0tlpBsq9fRiEZnLL8"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-4xl font-headline font-bold text-on-surface mb-4 tracking-tight">开启您的愈养之旅</h1>
            <p className="text-on-surface-variant text-lg max-w-xs mx-auto leading-relaxed">
              在宠愈 Sanctuary，每一只流浪的小生命都值得一个温暖的家。
            </p>
          </div>
        </div>
        
        <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center text-on-surface">
          <div className="mb-10">
            <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">
              {mode === 'login' ? '欢迎回来' : '立即注册'}
            </h2>
            <p className="text-on-surface-variant font-medium">
              {mode === 'login' ? '请登录您的账户' : '加入我们，给 TA 一个家'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                <Lock size={16} />
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 flex items-start gap-2 leading-relaxed">
                <div className="mt-0.5 flex-shrink-0">
                  <User size={16} />
                </div>
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-default text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                  placeholder="请输入邮箱地址" 
                  type="email" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-high border-none rounded-default text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                  placeholder="请输入您的密码" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors" 
                  type="button"
                >
                  <Eye size={20} />
                </button>
              </div>
              {mode === 'login' && (
                <div className="flex justify-end mt-2">
                  <a className="text-sm font-medium text-secondary hover:text-primary transition-colors" href="#">忘记密码？</a>
                </div>
              )}
            </div>
            
            <button 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full shadow-[0_8px_24px_rgba(143,78,0,0.2)] hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2" 
              type="submit"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : mode === 'login' ? '立即登录' : '注册并加入'}
            </button>
          </form>
          
          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-container-lowest text-on-surface-variant">其它选项</span>
            </div>
          </div>
          
          <div className="mt-8">
             <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="w-full flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-full hover:bg-surface-container transition-colors group"
            >
              <span className="text-sm font-bold text-primary">
                {mode === 'login' ? '没有账号？立即注册' : '已有账号？返回登录'}
              </span>
            </button>
          </div>
          
          <div className="mt-12 text-center text-xs text-on-surface-variant px-8">
            登录即表示您同意《用户协议》与《隐私保护条款》
          </div>
        </div>
      </div>

      <div className="fixed top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
