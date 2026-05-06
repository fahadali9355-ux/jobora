import { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { User } from 'lucide-react';

const columns = [
  { id: 'applied', label: 'Applied', color: 'bg-[#F5F5F2] border-black/5', headerColor: 'bg-black/5' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'bg-blue-50/50 border-blue-100', headerColor: 'bg-blue-100 text-blue-800' },
  { id: 'interview', label: 'Interview', color: 'bg-amber-50/50 border-amber-100', headerColor: 'bg-amber-100 text-amber-800' },
  { id: 'hired', label: 'Hired', color: 'bg-emerald-50/50 border-emerald-100', headerColor: 'bg-emerald-100 text-emerald-800' },
];

export default function ATSPipelinePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobsRes = await jobsAPI.getAll();
        const jobsList = jobsRes.data.data || [];
        
        const appsPromises = jobsList.map((j: any) => applicationsAPI.getJobApplications(j.id));
        const appsResults = await Promise.all(appsPromises);
        let allApps: any[] = [];
        appsResults.forEach((res, index) => {
          const apps = res.data.data || [];
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

  // Map backend status to column id
  const getColId = (status: string) => {
    if (status === 'pending') return 'applied';
    if (status === 'shortlisted') return 'shortlisted';
    if (status === 'interview') return 'interview';
    if (status === 'hired') return 'hired';
    return null; // hide rejected from pipeline by default
  };

  const appsByCol = columns.reduce((acc, col) => {
    acc[col.id] = applications.filter(a => getColId(a.status) === col.id);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="px-8 lg:px-12 py-8 h-screen flex flex-col">
      <header className="mb-8 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Workflow</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          ATS <span className="font-serif italic font-normal text-black/60">Pipeline</span>
        </h1>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 min-h-0">
        {loading ? (
          columns.map((col, i) => (
             <div key={i} className="flex-1 min-w-[300px] h-full bg-black/5 animate-pulse rounded-sm"></div>
          ))
        ) : columns.map(col => (
          <div key={col.id} className={`flex-1 min-w-[300px] flex flex-col border ${col.color}`}>
            <div className={`px-4 py-3 border-b border-black/5 flex justify-between items-center ${col.headerColor || 'bg-white'}`}>
              <span className="text-[10px] uppercase tracking-widest font-bold">{col.label}</span>
              <span className="bg-white/50 text-black px-2 py-0.5 text-[9px] font-bold border border-black/10 rounded-full">{appsByCol[col.id]?.length || 0}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {appsByCol[col.id]?.map(app => (
                <div key={app.id} className="bg-white p-4 border border-black/10 shadow-sm cursor-grab hover:border-black/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-sm">{app.user?.name || 'Applicant'}</div>
                    <span className="text-[10px] font-bold text-black/40">{app.match_score}%</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-3">{app.job_title}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#F5F5F2] rounded-full flex items-center justify-center text-[8px] font-bold">
                       {app.user?.name ? app.user.name.charAt(0) : 'U'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
