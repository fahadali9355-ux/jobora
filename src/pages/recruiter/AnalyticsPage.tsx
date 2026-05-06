import { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { BarChart3, Users, Briefcase, Target } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({
    totalJobs: 0,
    totalApps: 0,
    shortlistRate: 0,
    avgMatch: 0,
    appsByJob: [],
    statusBreakdown: { applied: 0, shortlisted: 0, rejected: 0 },
    topSkills: []
  });
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
        const appsByJobData = [];
        
        // Tag Cloud logic
        let skillsMap: Record<string, number> = {};

        appsResults.forEach((res, index) => {
          const apps = res.data.data || [];
          allApps = [...allApps, ...apps];
          appsByJobData.push({ title: jobsList[index].title, count: apps.length });
          
          // extract skills from job
          const jobSkills = jobsList[index].skills_required || '';
          if (jobSkills) {
             const skillsArray = jobSkills.split(',').map((s:string) => s.trim()).filter((s:string) => s);
             skillsArray.forEach((s:string) => {
                 skillsMap[s] = (skillsMap[s] || 0) + 1;
             });
          }
        });

        const shortlisted = allApps.filter(a => a.status === 'shortlisted').length;
        const rejected = allApps.filter(a => a.status === 'rejected').length;
        const applied = allApps.filter(a => a.status === 'pending').length;
        
        const totalScore = allApps.reduce((acc, a) => acc + (a.match_score || 0), 0);
        
        // Sort skills by freq
        const sortedSkills = Object.entries(skillsMap).sort((a, b) => b[1] - a[1]).slice(0, 15);

        setData({
          totalJobs: jobsList.length,
          totalApps: allApps.length,
          shortlistRate: allApps.length ? Math.round((shortlisted / allApps.length) * 100) : 0,
          avgMatch: allApps.length ? Math.round(totalScore / allApps.length) : 0,
          appsByJob: appsByJobData,
          statusBreakdown: { applied, shortlisted, rejected },
          topSkills: sortedSkills
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsCards = [
    { label: 'Total Jobs', value: data.totalJobs, icon: Briefcase },
    { label: 'Total Applications', value: data.totalApps, icon: Users },
    { label: 'Shortlist Rate', value: `${data.shortlistRate}%`, icon: Target },
    { label: 'Avg Match Score', value: `${data.avgMatch}%`, icon: BarChart3 },
  ];

  const maxApps = Math.max(...data.appsByJob.map((d:any) => d.count), 1);

  return (
    <div className="px-8 lg:px-12 py-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Reports</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Recruitment <span className="font-serif italic font-normal text-black/60">Analytics</span>
        </h1>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((s, i) => (
          <div key={i} className="bg-white p-6 border border-black/5 flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 bg-[#F5F5F2] flex items-center justify-center">
              <s.icon className="w-4 h-4 text-black/40" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-1">{s.label}</span>
              {loading ? <div className="h-8 w-16 bg-black/5 animate-pulse"></div> : <span className="text-2xl font-bold tracking-tight">{s.value}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications by Job */}
        <section className="bg-white border border-black/5 p-8">
          <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Applications by Job</h2>
          {loading ? (
             <div className="space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-black/5 animate-pulse w-full"></div>)}
             </div>
          ) : data.appsByJob.length === 0 ? (
             <div className="text-sm text-black/40 font-serif italic py-4">No data available</div>
          ) : (
            <div className="space-y-4">
              {data.appsByJob.map((item: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{item.title}</span>
                    <span className="text-black/50">{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-[#F5F5F2] overflow-hidden">
                    <div className="h-full bg-[#1A1A1A] transition-all duration-1000" style={{ width: `${(item.count / maxApps) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-8">
          {/* Status Breakdown */}
          <section className="bg-white border border-black/5 p-8">
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Pipeline Funnel</h2>
            <div className="flex gap-2 h-24">
              <div className="flex-1 bg-black/5 flex flex-col items-center justify-center p-2 text-center border border-black/10">
                 <span className="text-xl font-bold">{loading ? '-' : data.statusBreakdown.applied}</span>
                 <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 mt-1">Applied</span>
              </div>
              <div className="flex-1 bg-emerald-50 text-emerald-900 flex flex-col items-center justify-center p-2 text-center border border-emerald-100">
                 <span className="text-xl font-bold">{loading ? '-' : data.statusBreakdown.shortlisted}</span>
                 <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 mt-1">Shortlisted</span>
              </div>
              <div className="flex-1 bg-red-50 text-red-900 flex flex-col items-center justify-center p-2 text-center border border-red-100">
                 <span className="text-xl font-bold">{loading ? '-' : data.statusBreakdown.rejected}</span>
                 <span className="text-[9px] uppercase tracking-widest font-bold text-red-600 mt-1">Rejected</span>
              </div>
            </div>
          </section>

          {/* Skill Tag Cloud */}
          <section className="bg-[#1A1A1A] text-white p-8">
            <h2 className="text-[11px] uppercase tracking-widest font-bold text-white/50 mb-6">Top Skills in Demand</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-3 items-center">
               {loading ? (
                  <div className="h-8 bg-white/10 w-full animate-pulse"></div>
               ) : data.topSkills.length === 0 ? (
                  <div className="text-sm text-white/40 font-serif italic py-2">No skills data available</div>
               ) : data.topSkills.map(([skill, count]: any, i: number) => {
                  // Size logic: count 1 = 12px, count 5 = 24px
                  const size = Math.min(12 + (count * 2), 28);
                  const opacity = Math.max(0.4 + (count * 0.1), 1);
                  return (
                    <span key={i} style={{ fontSize: `${size}px`, opacity }} className="font-bold tracking-tight">
                       {skill}
                    </span>
                  );
               })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
