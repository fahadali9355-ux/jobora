import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, Brain, FileBarChart, Settings,
  User, TrendingUp, Activity, Cpu, Shield, RefreshCw, Download, Trash2,
  Edit, Ban, CheckCircle2
} from 'lucide-react';
import { adminAPI } from '../../services/api';



const aiModels = [
  { name: 'BERT Match Accuracy', value: 94 },
  { name: 'Resume Parse Success Rate', value: 98 },
  { name: 'NLP Entity Extraction', value: 91 },
  { name: 'Skill Classification F1', value: 89 },
];

const roleColors: Record<string, string> = {
  seeker: 'bg-blue-50 text-blue-700 border-blue-200',
  recruiter: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminOverview() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers()
        ]);
        setStats(statsRes.data.data);
        setUsersList(usersRes.data.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const suspendUser = async (id: number) => {
    try {
      await adminAPI.updateUser(id, { status: 'suspended' });
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
    } catch (error) {
      alert("Failed to suspend user");
    }
  };

  const platformStats = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users },
    { label: 'Active Jobs', value: stats?.total_jobs || 0, icon: Briefcase },
    { label: 'Resumes Processed Today', value: stats?.resumes_parsed || 0, icon: Activity },
    { label: 'AI Match Accuracy', value: '94.2%', icon: Cpu },
    { label: 'Total Applications', value: stats?.total_applications || 0, icon: TrendingUp },
    { label: 'Platform Revenue', value: '$0', icon: Shield },
  ];

  // Derive activity from newest users
  const activities = [...usersList]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(u => ({
      time: new Date(u.created_at).toLocaleDateString(),
      event: 'New user registered',
      detail: `${u.email} — ${u.role}`
    }));

  return (
    <>
        <header className="px-8 lg:px-12 py-8 border-b border-black/5 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">System Administration</span>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Admin <span className="font-serif italic font-normal text-black/60">Control Panel</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-black/10 text-[10px] uppercase tracking-widest font-bold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </div>
        </header>

        <div className="px-8 lg:px-12 py-8">
          {/* Platform Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {platformStats.map(s => (
              <div key={s.label} className="bg-[#F5F5F2] p-6 border border-black/5 flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-white flex items-center justify-center border border-black/5">
                  <s.icon className="w-4 h-4 text-black/40" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-1">{s.label}</span>
                  {loading ? (
                    <div className="h-8 bg-black/5 animate-pulse w-1/2"></div>
                  ) : (
                    <span className="text-2xl font-bold tracking-tight">{s.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* User Management */}
          <section className="mb-12">
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">User Management</h2>
            <div className="bg-white border border-black/5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[9px] uppercase tracking-widest font-bold text-black/40 px-5 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="p-4"><div className="h-10 bg-black/5 animate-pulse w-full"></div></td></tr>
                  ) : usersList.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-sm text-black/40 font-serif italic">No users found.</td></tr>
                  ) : usersList.map(u => {
                    const isActive = u.status === 'active';
                    return (
                      <tr key={u.id} className="border-b border-black/5 last:border-0 hover:bg-[#F5F5F2]/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium flex items-center gap-3">
                          <div className="h-7 w-7 bg-[#F5F5F2] rounded-full flex items-center justify-center shrink-0">
                            <User className="w-3 h-3 text-black/30" />
                          </div>
                          {u.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-black/40">{u.email}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border ${roleColors[u.role] || 'bg-gray-50 text-gray-700'}`}>{u.role}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                            {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-black/40">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            {isActive && (
                              <button onClick={() => suspendUser(u.id)} className="p-2 border border-black/10 hover:bg-red-50 transition-colors" title="Suspend User">
                                <Ban className="w-3 h-3 text-red-400" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* AI Model Performance */}
            <section>
              <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">AI Model Performance</h2>
              <div className="bg-white border border-black/5 p-6 space-y-6">
                {aiModels.map(m => (
                  <div key={m.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-black/60">{m.name}</span>
                      <span className="text-sm font-bold">{m.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 overflow-hidden">
                      <div className="h-full bg-[#1A1A1A] transition-all duration-1000" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Recent Activity Log</h2>
              <div className="bg-white border border-black/5 p-6">
                <div className="space-y-0">
                  {loading ? (
                    <div className="h-20 bg-black/5 animate-pulse w-full"></div>
                  ) : activities.length === 0 ? (
                    <div className="py-4 text-sm text-black/40 font-serif italic">No recent activity.</div>
                  ) : activities.map((a, i) => (
                    <div key={i} className="flex gap-4 py-4 border-b border-black/5 last:border-0">
                      <span className="text-[10px] text-black/30 w-20 shrink-0 pt-0.5">{a.time}</span>
                      <div>
                        <div className="text-sm font-medium">{a.event}</div>
                        <div className="text-[11px] text-black/40 mt-0.5">{a.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Quick Actions */}
          <section>
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="btn-31">
                <span className="text-container"><span className="text flex items-center gap-2"><RefreshCw className="w-3 h-3" />Retrain Model</span></span>
              </button>
              <button className="btn-31">
                <span className="text-container"><span className="text flex items-center gap-2"><Download className="w-3 h-3" />Export Report</span></span>
              </button>
              <button className="btn-31">
                <span className="text-container"><span className="text flex items-center gap-2"><Trash2 className="w-3 h-3" />Clear Cache</span></span>
              </button>
            </div>
          </section>
        </div>
      </>
  );
}
