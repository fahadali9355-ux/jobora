import { useState } from 'react';
import { Bell, Briefcase, FileText, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, icon: Briefcase, title: "Your application for Software Engineer was viewed", time: "2 hours ago", read: false },
    { id: 2, icon: Bell, title: "New job matching your profile: Data Scientist at TechCorp", time: "1 day ago", read: false },
    { id: 3, icon: FileText, title: "Your resume score improved to 75", time: "3 days ago", read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="px-8 lg:px-12 py-8 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Updates</span>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Recent <span className="font-serif italic font-normal text-black/60">Notifications</span>
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[10px] uppercase tracking-widest font-bold text-black/50 hover:text-black flex items-center gap-1 transition-colors">
            <Check className="w-3 h-3" /> Mark all as read
          </button>
        )}
      </header>

      <div className="bg-white border border-black/5">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-black/40 font-serif italic text-lg">You have no notifications.</div>
        ) : (
          <div className="divide-y divide-black/5">
            {notifications.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className={`p-6 flex items-start gap-4 transition-colors hover:bg-[#F5F5F2]/50 ${n.read ? 'opacity-60' : ''}`}>
                  <div className="h-10 w-10 shrink-0 bg-[#F5F5F2] flex items-center justify-center border border-black/5 rounded-full relative">
                    <Icon className="w-4 h-4 text-black/60" />
                    {!n.read && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1 pr-4">{n.title}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">{n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
