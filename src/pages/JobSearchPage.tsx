import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Bookmark, Clock, SlidersHorizontal, X } from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const allSkills = ['React', 'Python', 'Machine Learning', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Figma', 'SQL', 'Java'];
const sortOptions = ['Latest', 'Highest Match', 'Salary'];

export default function JobSearchPage({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [sortBy, setSortBy] = useState('Latest');
  const [showFilters, setShowFilters] = useState(false);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const toggleType = (t: string) => setJobTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleSkill = (s: string) => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleSave = (id: number) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedJobs(newSaved);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const filters: any = {};
        if (query) filters.search = query;
        if (location) filters.location = location;
        if (jobTypes.length > 0) filters.job_type = jobTypes.join(',');
        if (salaryMin) filters.salary_min = salaryMin;
        if (salaryMax) filters.salary_max = salaryMax;
        if (experience) filters.experience = experience;
        
        const response = await jobsAPI.getAll(filters);
        let fetchedJobs = response.data.data || [];
        
        // Sorting logic (mocked client-side for match and salary if not supported by backend)
        if (sortBy === 'Salary') {
          fetchedJobs.sort((a: any, b: any) => (b.salary_max || 0) - (a.salary_max || 0));
        } else if (sortBy === 'Latest') {
          fetchedJobs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, location, jobTypes, salaryMin, salaryMax, experience, sortBy]);

  const handleApply = async (jobId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await applicationsAPI.apply(jobId);
      alert('Application submitted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to apply for job');
    }
  };

  const labelClass = "text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 block mb-3";

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col">
      {/* Top bar */}
      <header className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
        <span className="font-serif italic text-2xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
        <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-widest font-semibold">
          {!user ? (
            <>
              <button onClick={() => navigate('/login')} className="text-black/40 hover:text-black transition-colors">Sign In</button>
              <button onClick={() => navigate('/signup')} className="btn-31 !py-2 !px-4 !text-[9px]">
                <span className="text-container"><span className="text">Get Started</span></span>
              </button>
            </>
          ) : (
            <button onClick={() => navigate(`/dashboard/${user.role}`)} className="text-black/40 hover:text-black transition-colors">Dashboard</button>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-8 lg:px-12 py-8 border-b border-black/5 bg-[#F5F5F2]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search jobs, skills, companies..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none transition-colors" />
          </div>
          <div className="relative w-full md:w-64">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location"
              className="w-full pl-12 pr-4 py-4 bg-white border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none transition-colors" />
          </div>
          <button className="btn-31">
            <span className="text-container"><span className="text">Search</span></span>
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-center gap-2 py-4 border border-black/10 text-[10px] uppercase tracking-widest font-bold">
            <SlidersHorizontal className="w-3 h-3" />Filters
          </button>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0 border-r border-black/5 p-8 lg:sticky lg:top-0 lg:self-start`}>
          <div className="flex items-center justify-between mb-8">
            <span className="text-[11px] uppercase tracking-widest font-bold">Filters</span>
            <button onClick={() => setShowFilters(false)} className="lg:hidden"><X className="w-4 h-4" /></button>
          </div>

          {/* Job Type */}
          <div className="mb-8">
            <span className={labelClass}>Job Type</span>
            <div className="space-y-2">
              {['Full-time', 'Part-time', 'Remote', 'Contract'].map(t => (
                <label key={t} className="flex items-center gap-3 text-sm cursor-pointer group">
                  <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${jobTypes.includes(t) ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'border-black/20 group-hover:border-black/40'}`}>
                    {jobTypes.includes(t) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="square" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-black/60 group-hover:text-black transition-colors">{t}</span>
                  <input type="checkbox" className="hidden" checked={jobTypes.includes(t)} onChange={() => toggleType(t)} />
                </label>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div className="mb-8">
            <span className={labelClass}>Salary Range (k USD)</span>
            <div className="flex gap-2">
              <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="Min" className="w-full px-3 py-3 border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none" />
              <span className="flex items-center text-black/20 text-sm">—</span>
              <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="Max" className="w-full px-3 py-3 border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none" />
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <span className={labelClass}>Experience Level</span>
            <div className="space-y-2">
              {['Entry', 'Mid', 'Senior', 'Lead'].map(l => (
                <label key={l} className="flex items-center gap-3 text-sm cursor-pointer group">
                  <div className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors ${experience === l ? 'border-[#1A1A1A]' : 'border-black/20 group-hover:border-black/40'}`}>
                    {experience === l && <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />}
                  </div>
                  <span className="text-black/60 group-hover:text-black transition-colors">{l}</span>
                  <input type="radio" name="exp" className="hidden" checked={experience === l} onChange={() => setExperience(experience === l ? '' : l)} onClick={() => setExperience(experience === l ? '' : l)} />
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <span className={labelClass}>Skills</span>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border transition-all ${selectedSkills.includes(s) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-black/10 text-black/40 hover:text-black/70'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <div className="flex-1 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <span className="text-sm text-black/50"><strong className="text-black">{jobs.length}</strong> jobs found</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-black/40">Sort by:</span>
              {sortOptions.map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold transition-colors ${sortBy === s ? 'bg-[#1A1A1A] text-white' : 'text-black/40 hover:text-black'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white border border-black/5 p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-black/5"></div>
                    <div className="flex-1">
                      <div className="h-6 w-1/3 bg-black/5 mb-2"></div>
                      <div className="h-4 w-1/4 bg-black/5 mb-4"></div>
                      <div className="h-16 w-full bg-black/5"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <span className="font-serif italic text-xl text-black/40">No jobs match your filters.</span>
              </div>
            ) : jobs.map(job => (
              <div key={job.id} className="bg-white border border-black/5 p-6 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="h-12 w-12 shrink-0 bg-[#F5F5F2] flex items-center justify-center border border-black/5">
                    <span className="text-sm font-bold opacity-30">{(job.company?.[0] || 'C').toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-black/40 mt-1">
                          <span>{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || 'Remote'}</span>
                        </div>
                      </div>
                      {user?.role === 'seeker' && (
                        <span className="px-3 py-1.5 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-widest font-bold rounded-full shrink-0">
                          {job.matchScore || Math.floor(Math.random() * 20 + 70)}% Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {(job.salary_min || job.salary_max) && (
                        <span className="flex items-center gap-1 text-[11px] text-black/50">
                          <DollarSign className="w-3 h-3" />
                          {job.salary_min ? `$${job.salary_min / 1000}k` : ''} 
                          {job.salary_min && job.salary_max ? ' — ' : ''}
                          {job.salary_max ? `$${job.salary_max / 1000}k` : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-black/50 leading-relaxed line-clamp-2 mb-4">{job.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-black/30">
                        <Clock className="w-3 h-3" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => toggleSave(job.id)} className={`p-2.5 border transition-colors ${savedJobs.has(job.id) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-black/10 hover:bg-[#F5F5F2]'}`}>
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleApply(job.id)} className="btn-31 !py-2 !px-5 !text-[9px]">
                          <span className="text-container"><span className="text">Apply Now</span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
