import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Search, Upload, User, Bell,
  TrendingUp, TrendingDown, MapPin, DollarSign, Bookmark,
  ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationsAPI, resumeAPI, jobsAPI } from '../../services/api';



const resumeTips = [
  'Add a professional summary section',
  'Include quantifiable achievements',
  'List relevant certifications',
  'Improve keyword optimization for ATS',
];

const statusColors: Record<string, string> = {
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons: Record<string, typeof CheckCircle2> = {
  shortlisted: CheckCircle2,
  pending: AlertCircle,
  rejected: XCircle,
};

export default function SeekerOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState<any>(null);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [appsRes, resumeRes, jobsRes] = await Promise.all([
          applicationsAPI.getSeekerApplications(),
          resumeAPI.get(user.id).catch(() => ({ data: { data: null } })), // may return 404 if no resume
          jobsAPI.getAll()
        ]);
        
        setApplications(appsRes.data.data || []);
        
        // Extract real resume score from parsed_data
        const rawResume = resumeRes.data.data;
        if (rawResume && rawResume.parsed_data) {
          const parsed = typeof rawResume.parsed_data === 'string' ? JSON.parse(rawResume.parsed_data) : rawResume.parsed_data;
          setResumeData({ ...rawResume, ...parsed });
        } else {
          setResumeData(rawResume);
        }
        
        setRecommendedJobs((jobsRes.data.data || []).slice(0, 3));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const appsSent = applications.length;
  const interviews = applications.filter(a => a.status === 'shortlisted').length;
  const matchSum = applications.reduce((acc, a) => acc + (a.match_score || 0), 0);
  const avgMatch = appsSent > 0 ? Math.round(matchSum / appsSent) : 0;

  const stats = [
    { label: 'Applications Sent', value: appsSent.toString(), trend: 'up', change: 'Total' },
    { label: 'Interviews Scheduled', value: interviews.toString(), trend: 'up', change: 'Shortlisted' },
    { label: 'Profile Views', value: '0', trend: 'up', change: 'New' },
    { label: 'Match Score Avg', value: `${avgMatch}%`, trend: avgMatch >= 70 ? 'up' : 'down', change: 'Average' },
  ];

  return (
    <>
        {/* Header */}
        <header className="px-8 lg:px-12 py-8 border-b border-black/5 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Dashboard</span>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Good morning, <span className="font-serif italic font-normal text-black/60">{user?.name?.split(' ')[0] || 'User'}.</span>
            </h1>
          </div>
          <span className="text-[11px] text-black/40 hidden md:block">{today}</span>
        </header>

        <div className="px-8 lg:px-12 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#F5F5F2] p-6 border border-black/5">
                <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-3">{s.label}</span>
                {loading ? (
                  <div className="h-10 bg-black/5 animate-pulse w-1/2"></div>
                ) : (
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold tracking-tight">{s.value}</span>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${s.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {s.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.change}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left 2/3 */}
            <div className="xl:col-span-2 space-y-8">
              {/* Recommended Jobs */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50">Recommended Jobs</h2>
                  <button onClick={() => navigate('/jobs')} className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black flex items-center gap-1 transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-black/5 animate-pulse w-full"></div>)
                  ) : recommendedJobs.length === 0 ? (
                    <div className="p-6 border border-black/5 text-center text-sm text-black/40 font-serif italic">No recommended jobs found.</div>
                  ) : recommendedJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-black/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] transition-shadow">
                      <div className="h-10 w-10 shrink-0 bg-[#F5F5F2] flex items-center justify-center border border-black/5">
                        <span className="text-[10px] font-bold opacity-40">{job.company[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1">{job.title}</div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-black/40">
                          <span>{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || 'Remote'}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary_min ? `$${job.salary_min / 1000}k` : 'Negotiable'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => navigate('/dashboard/seeker/jobs')} className="btn-31 !py-2 !px-4 !text-[9px]">
                          <span className="text-container"><span className="text">Apply</span></span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Applications Table */}
              <section>
                <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">My Applications</h2>
                <div className="bg-white border border-black/5 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/5">
                        {['Job Title', 'Company', 'Applied Date', 'Status'].map(h => (
                          <th key={h} className="text-left text-[9px] uppercase tracking-widest font-bold text-black/40 px-5 py-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                         <tr><td colSpan={4} className="p-4"><div className="h-10 bg-black/5 animate-pulse w-full"></div></td></tr>
                      ) : applications.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-sm text-black/40 font-serif italic">You haven't applied to any jobs yet.</td></tr>
                      ) : applications.map((app) => {
                        const StatusIcon = statusIcons[app.status] || AlertCircle;
                        const dateObj = new Date(app.applied_at);
                        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        return (
                          <tr key={app.id} className="border-b border-black/5 last:border-0 hover:bg-[#F5F5F2]/50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium">{app.job?.title}</td>
                            <td className="px-5 py-4 text-sm text-black/50">{app.job?.company}</td>
                            <td className="px-5 py-4 text-sm text-black/40 flex items-center gap-1"><Clock className="w-3 h-3" />{dateStr}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-widest font-bold border ${statusColors[app.status] || statusColors.pending}`}>
                                <StatusIcon className="w-3 h-3" />{app.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right sidebar - Resume Score */}
            <div className="space-y-6">
              <section className="bg-white border border-black/5 p-6">
                <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Resume Score</h3>
                {loading ? (
                  <div className="h-32 w-32 mx-auto bg-black/5 animate-pulse rounded-full mb-6"></div>
                ) : (
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#F5F5F2" strokeWidth="8" />
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#1A1A1A" strokeWidth="8" strokeDasharray={`${((resumeData?.resume_score || 0) / 100) * 352} 352`} strokeLinecap="square" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{resumeData?.resume_score || 0}</span>
                        <span className="text-[9px] uppercase tracking-widest text-black/40 font-bold">out of 100</span>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-3">Improvement Tips</span>
                  <ul className="space-y-3">
                    {resumeTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-[12px] text-black/60 leading-relaxed">
                        <span className="w-5 h-5 shrink-0 bg-[#F5F5F2] flex items-center justify-center text-[9px] font-bold mt-0.5">{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="bg-[#1A1A1A] text-white p-6">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-white/50 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => navigate('/dashboard/seeker/jobs')} className="w-full flex items-center justify-between py-3 px-4 text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 transition-colors">
                    <span>Search Jobs</span><Search className="w-3 h-3" />
                  </button>
                  <button className="w-full flex items-center justify-between py-3 px-4 text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 transition-colors">
                    <span>Update Resume</span><Upload className="w-3 h-3" />
                  </button>
                  <button className="w-full flex items-center justify-between py-3 px-4 text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 transition-colors">
                    <span>Saved Jobs</span><Bookmark className="w-3 h-3" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </>
  );
}
