import { useState, useEffect } from 'react';
import { jobsAPI } from '../../services/api';
import { Search, Briefcase, Trash2, Power } from 'lucide-react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await jobsAPI.getAll();
        setJobs(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        await jobsAPI.delete(id);
        setJobs(prev => prev.filter(j => j.id !== id));
      } catch (err) {
        alert("Failed to delete job.");
      }
    }
  };

  const handleToggleStatus = async (job: any) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await jobsAPI.update(job.id, { status: newStatus });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
    } catch (err) {
      alert("Failed to update job status");
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-8 lg:px-12 py-8">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Job Management</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Active <span className="font-serif italic font-normal text-black/60">Listings</span>
        </h1>
      </header>

      {/* Filters */}
      <div className="flex justify-end mb-8">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-black/40" />
          <input 
            type="text" 
            placeholder="Search jobs or companies..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-black/10 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-black/5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5">
              {['Job Title', 'Company', 'Posted Date', 'Applicants', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-[9px] uppercase tracking-widest font-bold text-black/40 px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-black/5"><td colSpan={6} className="p-4"><div className="h-10 bg-black/5 animate-pulse w-full"></div></td></tr>
              ))
            ) : filteredJobs.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-lg text-black/40 font-serif italic">No jobs found</td></tr>
            ) : filteredJobs.map(job => {
              const isOpen = job.status !== 'closed';
              return (
                <tr key={job.id} className="border-b border-black/5 hover:bg-[#F5F5F2]/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-bold">{job.title}</td>
                  <td className="px-5 py-4 text-sm text-black/60">{job.company}</td>
                  <td className="px-5 py-4 text-sm text-black/40">{new Date(job.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-sm font-bold text-black/60">0</td> {/* Mock applicants count as backend job model doesn't return count directly here */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full ${isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-black/5 text-black/60 border-black/10'}`}>
                      {isOpen ? 'Open' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex gap-2">
                    <button 
                      onClick={() => handleToggleStatus(job)} 
                      className="p-2 border border-black/10 hover:bg-black/5 transition-colors" title="Toggle Status"
                    >
                      <Power className={`w-4 h-4 ${isOpen ? 'text-amber-500' : 'text-emerald-500'}`} />
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)} 
                      className="p-2 border border-black/10 hover:bg-red-50 transition-colors" title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
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
