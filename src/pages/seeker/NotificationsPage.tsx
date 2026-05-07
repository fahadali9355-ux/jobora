import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import { Bell, CheckCircle2, AlertCircle, XCircle, Info, CheckCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeConfig: Record<string, { icon: any; bg: string; border: string; accent: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'text-emerald-600' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-600' },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', accent: 'text-red-600' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600' },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.data || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id: number) => {
    try {
      await notificationsAPI.markOneRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (n: any) => {
    if (!n.is_read) markOneRead(n.id);
    if (n.link) navigate(n.link);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="px-8 lg:px-12 py-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Notifications</span>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Notification <span className="font-serif italic font-normal text-black/60">Center</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>
      </header>

      <div className="space-y-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-black/5 animate-pulse border border-black/5"></div>
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/5">
            <Bell className="w-10 h-10 mx-auto mb-4 text-black/15" />
            <p className="text-black/40 font-serif italic text-lg">No notifications yet.</p>
            <p className="text-black/25 text-sm mt-2">When you apply for jobs or get updates, they'll appear here.</p>
          </div>
        ) : notifications.map(n => {
          const config = typeConfig[n.type] || typeConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-4 p-5 border transition-all cursor-pointer group ${
                n.is_read
                  ? 'bg-white border-black/5 hover:bg-[#F5F5F2]'
                  : `${config.bg} ${config.border} hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]`
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 shrink-0 flex items-center justify-center ${n.is_read ? 'bg-black/5' : config.bg} border ${n.is_read ? 'border-black/5' : config.border}`}>
                <Icon className={`w-5 h-5 ${n.is_read ? 'text-black/30' : config.accent}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-bold leading-tight ${n.is_read ? 'text-black/50' : 'text-black'}`}>
                    {n.title}
                  </h3>
                  {!n.is_read && (
                    <span className="w-2 h-2 shrink-0 bg-blue-500 rounded-full mt-1.5"></span>
                  )}
                </div>
                <p className={`text-[12px] leading-relaxed ${n.is_read ? 'text-black/35' : 'text-black/60'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="w-3 h-3 text-black/25" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-black/25">
                    {formatTime(n.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
