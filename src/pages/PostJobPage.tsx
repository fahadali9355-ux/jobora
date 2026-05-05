import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin, Building2, Briefcase, DollarSign, FileText, Tag, X } from 'lucide-react';
import { jobsAPI } from '../services/api';

const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract'];

interface FormData {
  title: string; department: string; location: string; jobType: string;
  salaryMin: string; salaryMax: string; description: string;
  skills: string[]; experience: string;
}

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState<FormData>({
    title: '', department: '', location: '', jobType: 'Full-time',
    salaryMin: '', salaryMax: '', description: '',
    skills: [], experience: '2',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);
      setError('');
      await jobsAPI.create({
        title: form.title,
        company: form.department || 'Company',
        location: form.location,
        salary_min: form.salaryMin ? parseInt(form.salaryMin) : null,
        salary_max: form.salaryMax ? parseInt(form.salaryMax) : null,
        description: form.description,
        requirements: form.skills.join(', '),
      });
      setShowToast(true);
      setTimeout(() => navigate('/dashboard/recruiter'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof FormData, val: string) => setForm(p => ({ ...p, [key]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(p => ({ ...p, skills: [...p.skills, s] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const inputClass = "w-full px-4 py-4 bg-transparent border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col">
      <header className="px-8 py-6 border-b border-black/5 flex items-center justify-between">
        <span className="font-serif italic text-2xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
        <button onClick={() => navigate('/dashboard/recruiter')} className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" />Back to Dashboard
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-8 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Post a <span className="font-serif italic font-normal text-black/60">New Job</span>
          </h1>
          <p className="text-sm text-black/40 mb-10">Fill in the details to publish your job listing</p>

          {/* Progress */}
          <div className="flex items-center gap-0 mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${step >= s ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F2] text-black/30'}`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-[2px] transition-colors ${step > s ? 'bg-[#1A1A1A]' : 'bg-black/10'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-8 text-[9px] uppercase tracking-widest font-bold text-black/40">
            <span className={step === 1 ? 'text-black' : ''}>Job Details</span>
            <span className={step === 2 ? 'text-black' : ''}>Description & Skills</span>
            <span className={step === 3 ? 'text-black' : ''}>Review & Publish</span>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior React Developer" className={`${inputClass} !pl-12`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Engineering" className={`${inputClass} !pl-12`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. San Francisco, CA" className={`${inputClass} !pl-12`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Job Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {jobTypes.map(t => (
                    <button key={t} onClick={() => set('jobType', t)}
                      className={`py-3 text-[10px] uppercase tracking-widest font-bold border transition-all ${form.jobType === t ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-black/10 text-black/40 hover:text-black/70'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Salary Range (USD)</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input type="number" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} placeholder="Min" className={`${inputClass} !pl-12`} />
                  </div>
                  <span className="flex items-center text-black/20">—</span>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input type="number" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} placeholder="Max" className={`${inputClass} !pl-12`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Job Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-black/30" />
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={8} className={`${inputClass} !pl-12 resize-none`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Required Skills</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                      placeholder="Type a skill and press Enter" className={`${inputClass} !pl-12`} />
                  </div>
                  <button onClick={addSkill} className="px-6 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black/80 transition-colors">Add</button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAE8E2] text-[9px] uppercase tracking-widest font-bold">
                        {s}
                        <button onClick={() => removeSkill(s)} className="text-black/40 hover:text-black"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Minimum Experience (Years)</label>
                <input type="number" min="0" max="20" value={form.experience} onChange={e => set('experience', e.target.value)} className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 3 - Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white border border-black/5 p-8 space-y-6">
                <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-4">Job Summary</h3>
                {[
                  { l: 'Title', v: form.title || '—' },
                  { l: 'Department', v: form.department || '—' },
                  { l: 'Location', v: form.location || '—' },
                  { l: 'Type', v: form.jobType },
                  { l: 'Salary', v: form.salaryMin && form.salaryMax ? `$${Number(form.salaryMin).toLocaleString()} — $${Number(form.salaryMax).toLocaleString()}` : '—' },
                  { l: 'Experience', v: `${form.experience}+ years` },
                ].map(r => (
                  <div key={r.l} className="flex justify-between items-center py-3 border-b border-black/5 last:border-0">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black/40">{r.l}</span>
                    <span className="text-sm font-medium">{r.v}</span>
                  </div>
                ))}
                {form.description && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-2">Description</span>
                    <p className="text-sm text-black/60 leading-relaxed">{form.description}</p>
                  </div>
                )}
                {form.skills.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-2">Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-[#EAE8E2] text-[9px] uppercase tracking-widest font-bold">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-6 py-4 border border-black/10 text-[10px] uppercase tracking-widest font-bold hover:bg-[#F5F5F2] transition-colors">
                <ArrowLeft className="w-3 h-3" />Previous
              </button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-6 py-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black/80 transition-colors">
                Next<ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <div className="flex flex-col items-end">
                {error && <span className="text-[10px] text-red-500 font-bold mb-2 uppercase tracking-widest">{error}</span>}
                <button onClick={handlePublish} disabled={loading} className="btn-31">
                  <span className="text-container"><span className="text">{loading ? 'Publishing...' : 'Publish Job'}</span></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-[#1A1A1A] text-white px-6 py-4 shadow-xl flex items-center gap-3 animate-[slideUp_0.3s_ease-out] z-50">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-[11px] uppercase tracking-widest font-bold">Job Published Successfully</span>
        </div>
      )}
    </div>
  );
}
