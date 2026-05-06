import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons: Record<string, any> = {
  shortlisted: CheckCircle2,
  pending: AlertCircle,
  rejected: XCircle,
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await applicationsAPI.getSeekerApplications();
        setApplications(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = filter === 'All' ? applications : applications.filter(a => a.status === filter.toLowerCase());

  return (
    <div className="px-8 lg:px-12 py-8">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Applications</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          My <span className="font-serif italic font-normal text-black/60">Job Applications</span>
        </h1>
      </header>

      {/* Filters */}
      <div className="flex gap-2 mb-8 border-b border-black/5 pb-4">
        {['All', 'Pending', 'Shortlisted', 'Rejected'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
              filter === tab ? 'bg-[#1A1A1A] text-white' : 'bg-white text-black border border-black/10 hover:bg-black/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-black/5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5">
              {['Job Title', 'Company', 'Applied Date', 'Match Score', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left text-[9px] uppercase tracking-widest font-bold text-black/40 px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-black/5"><td colSpan={6} className="p-4"><div className="h-10 bg-black/5 animate-pulse w-full"></div></td></tr>
              ))
            ) : filteredApps.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-lg text-black/40 font-serif italic">No applications yet</td></tr>
            ) : filteredApps.map((app) => {
              const StatusIcon = statusIcons[app.status] || AlertCircle;
              const dateObj = new Date(app.applied_at);
              const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <tr key={app.id} className="border-b border-black/5 last:border-0 hover:bg-[#F5F5F2]/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium">{app.job?.title}</td>
                  <td className="px-5 py-4 text-sm text-black/50">{app.job?.company}</td>
                  <td className="px-5 py-4 text-sm text-black/40 flex items-center gap-1"><Clock className="w-3 h-3" />{dateStr}</td>
                  <td className="px-5 py-4 text-sm font-bold text-black/60">{app.match_score}%</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold border ${statusColors[app.status] || statusColors.pending}`}>
                      <StatusIcon className="w-3 h-3" />{app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
