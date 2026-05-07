import { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, User, CheckCircle2, XCircle, X, FileText, Mail, Phone, Briefcase, GraduationCap } from 'lucide-react';

export default function CandidatesPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('match');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const jobsRes = await jobsAPI.getAll();
        const allJobs = jobsRes.data.data || [];
        // Only show recruiter's own jobs
        const myJobs = allJobs.filter((j: any) => j.recruiter_id === user.id);
        setJobs(myJobs);

        // Fetch applications for each of my jobs individually (catch errors per-job)
        let allApps: any[] = [];
        for (const job of myJobs) {
          try {
            const res = await applicationsAPI.getJobApplications(job.id);
            const apps = res.data.data || [];
            const jobApps = apps.map((a: any) => ({ ...a, job_title: job.title }));
            allApps = [...allApps, ...jobApps];
          } catch (err) {
            console.warn(`Failed to fetch apps for job ${job.id}:`, err);
          }
        }
        setApplications(allApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await applicationsAPI.updateStatus(id, newStatus);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      // Also update the selected candidate if it's open
      if (selectedCandidate?.id === id) {
        setSelectedCandidate((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
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
                  {app.seeker?.name ? app.seeker.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm">{app.seeker?.name || 'Applicant'}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">{app.job_title}</div>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${(app.match_score||0) >= 80 ? 'border-emerald-400 text-emerald-600' : (app.match_score||0) >= 50 ? 'border-amber-400 text-amber-600' : 'border-red-400 text-red-600'}`}>
                <span className="font-bold text-sm">{app.match_score || 0}%</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-2">Key Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {(app.resume?.skills || []).slice(0, 5).map((s: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-[#F5F5F2] text-black/60 text-[9px] uppercase tracking-widest font-bold border border-black/5">{s}</span>
                ))}
                {(!app.resume?.skills || app.resume.skills.length === 0) && <span className="text-[10px] text-black/30 italic">No resume data</span>}
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

            {/* View Resume Button */}
            <button 
              onClick={() => setSelectedCandidate(app)} 
              className="w-full mt-3 py-2 border border-black/10 text-[10px] uppercase tracking-widest font-bold text-black/50 hover:text-black hover:border-black/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3 h-3" /> View Full Resume
            </button>
          </div>
        ))}
      </div>

      {/* Resume Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCandidate(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-black/5 px-8 py-5 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-xl">
                  {selectedCandidate.seeker?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedCandidate.seeker?.name || 'Candidate'}</h2>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">Applied for: {selectedCandidate.job_title}</div>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-8">
              {/* Match Score */}
              <div className="flex items-center gap-6 p-5 bg-[#F5F5F2]">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${(selectedCandidate.match_score||0) >= 80 ? 'border-emerald-400' : (selectedCandidate.match_score||0) >= 50 ? 'border-amber-400' : 'border-red-400'}`}>
                  <span className="text-2xl font-bold">{selectedCandidate.match_score || 0}%</span>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-1">AI Match Score</div>
                  <div className="text-sm text-black/60">
                    {(selectedCandidate.match_score || 0) >= 80 ? 'Excellent match for this role' : (selectedCandidate.match_score || 0) >= 50 ? 'Good potential match' : 'Below average match'}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-3">Contact Information</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-black/30" />
                    <span>{selectedCandidate.resume?.email || selectedCandidate.seeker?.email || 'Not available'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-black/30" />
                    <span>{selectedCandidate.resume?.phone || 'Not available'}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-3">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {(selectedCandidate.resume?.skills || []).map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {s}
                    </span>
                  ))}
                  {(!selectedCandidate.resume?.skills || selectedCandidate.resume.skills.length === 0) && (
                    <span className="text-sm text-black/40 italic">No skills data available. Candidate may not have uploaded a resume.</span>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Experience
                  {selectedCandidate.resume?.experience_years > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-black/5 text-[9px]">{selectedCandidate.resume.experience_years} years</span>
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed text-black/70 bg-[#F5F5F2] p-4">
                  {selectedCandidate.resume?.experience || 'No experience details available.'}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed text-black/70 bg-[#F5F5F2] p-4">
                  {selectedCandidate.resume?.education || 'No education details available.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-black/5">
                {selectedCandidate.status === 'shortlisted' ? (
                  <div className="flex-1 py-3 text-center text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700">✓ Shortlisted</div>
                ) : selectedCandidate.status === 'rejected' ? (
                  <div className="flex-1 py-3 text-center text-[10px] uppercase tracking-widest font-bold bg-red-50 text-red-700">✗ Rejected</div>
                ) : (
                  <>
                    <button onClick={() => handleStatusUpdate(selectedCandidate.id, 'shortlisted')} className="flex-1 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-colors">Shortlist Candidate</button>
                    <button onClick={() => handleStatusUpdate(selectedCandidate.id, 'rejected')} className="flex-1 py-3 bg-white border border-black/10 text-black/60 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-[10px] uppercase tracking-widest font-bold transition-colors">Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
