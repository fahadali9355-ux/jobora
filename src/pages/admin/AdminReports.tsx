import { useState, useEffect } from 'react';
import { adminAPI, jobsAPI } from '../../services/api';
import { Check, Download, Users, Briefcase, DollarSign, FileBarChart, Clock } from 'lucide-react';

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-8 right-8 bg-[#1A1A1A] text-white px-6 py-4 shadow-xl flex items-center gap-3 z-50 animate-[slideUp_0.3s_ease-out]">
      <Check className="w-5 h-5 text-emerald-400" />
      <span className="text-[11px] uppercase tracking-widest font-bold">{message}</span>
    </div>
  );
}

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [uRes, jRes] = await Promise.all([adminAPI.getUsers(), jobsAPI.getAll()]);
        setUsers(uRes.data.data || []);
        setJobs(jRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const now = new Date();
  const thisMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const jobsThisMonth = jobs.filter((j) => thisMonth(j.created_at)).length;
  const usersThisMonth = users.filter((u) => thisMonth(u.created_at)).length;

  const statsCards = [
    { label: 'Total Revenue', value: '$0', icon: DollarSign, note: 'Placeholder' },
    { label: 'Jobs Posted This Month', value: loading ? '…' : jobsThisMonth.toString(), icon: Briefcase, note: 'From database' },
    { label: 'New Users This Month', value: loading ? '…' : usersThisMonth.toString(), icon: Users, note: 'From database' },
    { label: 'Applications This Month', value: '0', icon: FileBarChart, note: 'Coming soon' },
  ];

  const handleExportUsers = async () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Joined'];
    const rows = users.map((u) => [
      u.id?.toString() ?? '',
      u.name ?? '',
      u.email ?? '',
      u.role ?? '',
      u.status ?? '',
      u.created_at ? new Date(u.created_at).toLocaleDateString() : '',
    ]);
    downloadCSV('jobora_users.csv', rows, headers);
    showToast('Users CSV downloaded!');
  };

  const handleExportJobs = async () => {
    const headers = ['ID', 'Title', 'Company', 'Location', 'Salary Min', 'Salary Max', 'Posted'];
    const rows = jobs.map((j) => [
      j.id?.toString() ?? '',
      j.title ?? '',
      j.company ?? '',
      j.location ?? '',
      j.salary_min?.toString() ?? '',
      j.salary_max?.toString() ?? '',
      j.created_at ? new Date(j.created_at).toLocaleDateString() : '',
    ]);
    downloadCSV('jobora_jobs.csv', rows, headers);
    showToast('Jobs CSV downloaded!');
  };

  // Sort users newest first for timeline
  const timeline = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const roleColors: Record<string, string> = {
    admin: 'bg-amber-400',
    recruiter: 'bg-purple-400',
    seeker: 'bg-blue-400',
  };

  return (
    <div className="px-8 lg:px-12 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">
          Analytics
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Platform <span className="font-serif italic font-normal text-black/60">Reports</span>
        </h1>
      </header>

      {/* ── Section 1: Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statsCards.map((s) => (
          <div key={s.label} className="bg-white border border-black/5 p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 bg-[#F5F5F2] flex items-center justify-center">
                <s.icon className="w-4 h-4 text-black/40" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-1">
                  {s.label}
                </span>
                <span className="text-2xl font-bold tracking-tight">{s.value}</span>
                <span className="text-[9px] text-black/30 font-medium block mt-0.5">{s.note}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* ── Section 2: Export Reports ── */}
          <section className="bg-white border border-black/5 p-8">
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Reports
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleExportUsers}
                className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-black/10 hover:border-black hover:bg-[#F5F5F2] transition-all group"
              >
                <Users className="w-6 h-6 text-black/40 group-hover:text-black transition-colors" />
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest font-bold">Export Users</div>
                  <div className="text-[9px] text-black/40 mt-0.5">CSV format</div>
                </div>
              </button>

              <button
                onClick={handleExportJobs}
                className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-black/10 hover:border-black hover:bg-[#F5F5F2] transition-all group"
              >
                <Briefcase className="w-6 h-6 text-black/40 group-hover:text-black transition-colors" />
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest font-bold">Export Jobs</div>
                  <div className="text-[9px] text-black/40 mt-0.5">CSV format</div>
                </div>
              </button>

              <button
                onClick={() => showToast('Applications export coming soon!')}
                className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-black/10 hover:border-amber-300 hover:bg-amber-50 transition-all group opacity-60"
              >
                <FileBarChart className="w-6 h-6 text-black/40 group-hover:text-amber-600 transition-colors" />
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest font-bold">Export Applications</div>
                  <div className="text-[9px] text-amber-600 mt-0.5 font-bold">Coming Soon</div>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* ── Section 3: Activity Timeline ── */}
        <section className="bg-white border border-black/5 p-8">
          <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Activity Timeline
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-black/5 animate-pulse" />
              ))}
            </div>
          ) : timeline.length === 0 ? (
            <p className="text-sm text-black/40 font-serif italic">No activity yet.</p>
          ) : (
            <div className="space-y-4">
              {timeline.map((u) => (
                <div key={u.id} className="flex items-start gap-3">
                  <div className="mt-1.5 shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${roleColors[u.role] ?? 'bg-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium leading-snug">
                      <span className="font-bold">{u.name}</span> joined as{' '}
                      <span className="font-bold capitalize">{u.role}</span>
                    </p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-black/30 mt-0.5">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
