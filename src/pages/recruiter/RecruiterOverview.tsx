import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Users, GitBranch, BarChart3, Settings,
  User, TrendingUp, Code, FileText, Zap, Eye, Pause, Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../../services/api';



const chartData = [
  { label: 'Mon', value: 35 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 41 },
  { label: 'Thu', value: 68 },
  { label: 'Fri', value: 59 },
  { label: 'Sat', value: 22 },
  { label: 'Sun', value: 15 },
];

export default function RecruiterOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const jobsRes = await jobsAPI.getAll();
        const allJobs = jobsRes.data.data || [];
        const myJobs = allJobs.filter((j: any) => j.recruiter_id === user.id);
        setJobs(myJobs);

        // Fetch apps per-job individually to avoid one 403 killing everything
        const allApps: any[] = [];
        for (const job of myJobs) {
          try {
            const res = await applicationsAPI.getJobApplications(job.id);
            const jobApps = (res.data.data || []).map((a: any) => ({ ...a, job }));
            allApps.push(...jobApps);
          } catch (err) {
            console.warn(`Failed to fetch apps for job ${job.id}:`, err);
          }
        }
        
        setApplications(allApps);
      } catch (err: any) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleStatus = async (jobId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await jobsAPI.update(jobId, { status: newStatus });
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      alert('Failed to update job status');
    }
  };

  const updateApplicationStatus = async (appId: number, status: string) => {
    try {
      await applicationsAPI.updateStatus(appId, status);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const activeApps = applications.length;
  const shortlistedToday = applications.filter(a => a.status === 'shortlisted').length; // simplified
  const avgMatch = activeApps > 0 ? Math.round(applications.reduce((acc, a) => acc + (a.match_score || 0), 0) / activeApps) : 0;

  const stats = [
    { label: 'Total Jobs Posted', value: totalJobs.toString(), change: `${activeJobs} Active` },
    { label: 'Active Applications', value: activeApps.toString(), change: 'Total' },
    { label: 'Shortlisted', value: shortlistedToday.toString(), change: 'All time' },
    { label: 'Avg Match Score', value: `${avgMatch}%`, change: 'Across all apps' },
  ];

  // Top candidates across all jobs
  const topCandidates = [...applications]
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
    .slice(0, 3);

  return (
    <>
        <header className="px-8 lg:px-12 py-8 border-b border-black/5 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Recruiter Portal</span>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              {user?.name?.split(' ')[0] || 'Company'} <span className="font-serif italic font-normal text-black/60">Hiring Hub</span>
            </h1>
          </div>
          <button onClick={() => navigate('/post-job')} className="btn-31 hidden md:block">
            <span className="text-container"><span className="text">Post New Job</span></span>
          </button>
        </header>

        <div className="px-8 lg:px-12 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map(s => (
              <div key={s.label} className="bg-[#F5F5F2] p-6 border border-black/5">
                <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-3">{s.label}</span>
                {loading ? (
                  <div className="h-10 bg-black/5 animate-pulse w-1/2"></div>
                ) : (
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold tracking-tight">{s.value}</span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{s.change}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Job Listings */}
          <section className="mb-12">
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Your Job Listings</h2>
            <div className="bg-white border border-black/5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    {['Job Title', 'Posted', 'Applicants', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left text-[9px] uppercase tracking-widest font-bold text-black/40 px-5 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="p-4"><div className="h-10 bg-black/5 animate-pulse w-full"></div></td></tr>
                  ) : jobs.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-sm text-black/40 font-serif italic">You haven't posted any jobs yet.</td></tr>
                  ) : jobs.map((job) => {
                    const jobApps = applications.filter(a => a.job_id === job.id).length;
                    const dateObj = new Date(job.created_at);
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const isActive = job.status === 'active';
                    return (
                      <tr key={job.id} className="border-b border-black/5 last:border-0 hover:bg-[#F5F5F2]/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium">{job.title}</td>
                        <td className="px-5 py-4 text-sm text-black/40">{dateStr}</td>
                        <td className="px-5 py-4 text-sm font-semibold">{jobApps}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => toggleStatus(job.id, job.status)} className={`flex items-center gap-2 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-black/5 text-black/40 border-black/10'}`}>
                            {isActive ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                            {isActive ? 'Active' : 'Paused'}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <button className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors">
                            <Eye className="w-3 h-3" />Candidates
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top AI-Ranked Candidates */}
          <section className="mb-12">
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Top AI-Ranked Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-black/5 animate-pulse w-full"></div>)
              ) : topCandidates.length === 0 ? (
                <div className="col-span-3 p-8 border border-black/5 text-center text-sm text-black/40 font-serif italic">No candidates applied yet.</div>
              ) : topCandidates.map(c => (
                <div key={c.id} className="bg-white border border-black/5 p-6 flex flex-col gap-5 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#F5F5F2] rounded-full flex items-center justify-center border border-black/5">
                      <User className="w-4 h-4 text-black/30" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.seeker?.name || 'Candidate'}</div>
                      <div className="text-[9px] text-black/40 uppercase tracking-widest truncate w-32">For: {c.job?.title}</div>
                    </div>
                  </div>

                  <div className="text-center py-3 bg-[#F5F5F2]">
                    <span className="text-4xl font-bold tracking-tight">{c.match_score || 0}%</span>
                    <span className="text-[9px] uppercase tracking-widest text-black/40 font-bold block mt-1">AI Match Score</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Code, label: 'Technical Match', val: Math.min(100, (c.match_score || 0) + 5) },
                      { icon: FileText, label: 'Experience', val: Math.min(100, (c.match_score || 0) - 2) },
                    ].map(s => (
                      <div key={s.label} className="space-y-1.5">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold">
                          <span className="text-black/60 flex items-center gap-1.5"><s.icon className="w-3 h-3" />{s.label}</span>
                          <span>{Math.round(s.val)}%</span>
                        </div>
                        <div className="h-1 w-full bg-black/5 overflow-hidden">
                          <div className="h-full bg-black/80" style={{ width: `${s.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {c.status === 'shortlisted' ? (
                      <div className="flex-1 py-2 text-center text-[9px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50">Shortlisted</div>
                    ) : c.status === 'rejected' ? (
                      <div className="flex-1 py-2 text-center text-[9px] uppercase tracking-widest font-bold text-red-600 bg-red-50">Rejected</div>
                    ) : (
                      <>
                        <button onClick={() => updateApplicationStatus(c.id, 'shortlisted')} className="btn-31 flex-1 !py-2 !text-[9px]">
                          <span className="text-container"><span className="text">Shortlist</span></span>
                        </button>
                        <button onClick={() => updateApplicationStatus(c.id, 'rejected')} className="flex-1 py-2 border border-black/10 text-[9px] uppercase tracking-widest font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Applications Bar Chart */}
          <section>
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Weekly Applications Overview</h2>
            <div className="bg-white border border-black/5 p-6">
              <div className="flex items-end gap-3 h-48">
                {chartData.map(d => (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-bold text-black/40">{d.value}</span>
                    <div className="w-full bg-[#F5F5F2] relative" style={{ height: '100%' }}>
                      <div className="absolute bottom-0 w-full bg-[#1A1A1A] transition-all duration-500" style={{ height: `${(d.value / 70) * 100}%` }} />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-black/40">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </>
  );
}
