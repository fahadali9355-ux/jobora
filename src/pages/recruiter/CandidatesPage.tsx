import { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { Search, Filter, User, CheckCircle2, XCircle } from 'lucide-react';

export default function CandidatesPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'date'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobsRes = await jobsAPI.getAll();
        const jobsList = jobsRes.data.data || [];
        setJobs(jobsList);

        // Fetch applications for all jobs
        const appsPromises = jobsList.map((j: any) => applicationsAPI.getJobApplications(j.id));
        const appsResults = await Promise.all(appsPromises);
        let allApps: any[] = [];
        appsResults.forEach((res, index) => {
          const apps = res.data.data || [];
          // Attach job title to application for display
          const jobApps = apps.map((a: any) => ({ ...a, job_title: jobsList[index].title }));
          allApps = [...allApps, ...jobApps];
        });
        setApplications(allApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await applicationsAPI.updateStatus(id, newStatus);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredApps = applications.filter(a => selectedJob === 'All' || a.job_id.toString() === selectedJob);
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'match') return (b.match_score || 0) - (a.match_score || 0);
    return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
  });

  return (
    <div className="px-8 lg:px-12 py-8">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Talent Pool</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          All <span className="font-serif italic font-normal text-black/60">Candidates</span>
        </h1>
      </header>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 pb-4 border-b border-black/5">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
            className="p-3 bg-white border border-black/10 text-sm font-medium focus:outline-none focus:border-black transition-colors"
          >
            <option value="All">All Jobs</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest font-bold text-black/40">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:outline-none"
            >
              <option value="match">Match Score</option>
              <option value="date">Date Applied</option>
            </select>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 bg-black/5 px-4 py-2">
          {sortedApps.length} Candidates Found
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-black/5 animate-pulse border border-black/5"></div>)
        ) : sortedApps.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-black/5">
             <p className="text-black/40 font-serif italic text-xl">No candidates yet. Post a job to start receiving applications.</p>
          </div>
        ) : sortedApps.map(app => (
          <div key={app.id} className="bg-white border border-black/5 p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-lg">
                  {app.user?.name ? app.user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm">{app.user?.name || 'Applicant'}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">{app.job_title}</div>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${(app.match_score||0) >= 80 ? 'border-emerald-400 text-emerald-600' : (app.match_score||0) >= 50 ? 'border-amber-400 text-amber-600' : 'border-red-400 text-red-600'}`}>
                <span className="font-bold text-sm">{app.match_score || 0}%</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-2">Key Skills Match</div>
              <div className="flex flex-wrap gap-1.5">
                {/* Mocking skills display since we don't have parsed resume skills in the app object directly */}
                {['React', 'TypeScript', 'Node.js'].map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#F5F5F2] text-black/60 text-[9px] uppercase tracking-widest font-bold border border-black/5">{s}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-black/5">
              {app.status === 'shortlisted' ? (
                 <span className="flex-1 py-2 text-center text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> Shortlisted</span>
              ) : app.status === 'rejected' ? (
                 <span className="flex-1 py-2 text-center text-[10px] uppercase tracking-widest font-bold bg-red-50 text-red-700 flex items-center justify-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>
              ) : (
                <>
                  <button onClick={() => handleStatusUpdate(app.id, 'shortlisted')} className="flex-1 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-colors">Shortlist</button>
                  <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="flex-1 py-2 bg-white border border-black/10 text-black/60 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-[10px] uppercase tracking-widest font-bold transition-colors">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
