import { useState, useEffect } from 'react';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification, getMyNotifications, markNotificationAsRead } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { authenticated } = useAuth();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (authenticated && isOpen) {
      loadNotifications();
    }
  }, [authenticated, isOpen]);

  const loadNotifications = async () => {
    const data = await getMyNotifications();
    setNotifications(data);
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  if (!authenticated) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-error text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-surface">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[60]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-[320px] max-h-[480px] bg-surface-container-low border border-outline-variant rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-high">
                <h3 className="font-bold flex items-center gap-2">
                  <Bell size={18} className="text-primary" />
                  消息中心
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-on-surface-variant space-y-2">
                    <Bell className="mx-auto opacity-20" size={48} />
                    <p className="text-sm">暂无消息</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all relative group",
                        notification.is_read 
                          ? "bg-surface text-on-surface-variant border-transparent" 
                          : "bg-primary/5 text-on-surface border-primary/20"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "mt-1",
                          notification.type === 'success' ? "text-tertiary" : 
                          notification.type === 'alert' ? "text-error" : "text-primary"
                        )}>
                          {notification.type === 'success' && <CheckCircle2 size={18} />}
                          {notification.type === 'alert' && <AlertTriangle size={18} />}
                          {notification.type === 'info' && <Info size={18} />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-relaxed">{notification.message}</p>
                          <p className="text-[10px] opacity-60">
                            {new Date(notification.created_at).toLocaleString('zh-CN', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <button 
                          onClick={() => handleMarkRead(notification.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          title="标记为已读"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 bg-surface-container-lowest text-center border-t border-outline-variant">
                  <p className="text-[10px] text-on-surface-variant">仅显示最近的通知内容</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
