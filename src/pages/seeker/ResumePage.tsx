import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

export default function ResumePage() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [score, setScore] = useState(0);

  const fetchResume = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await resumeAPI.get(user.id);
      setResumeData(res.data.data);
      setScore(res.data.data ? 85 : 0); // Mocking score for now
    } catch (err) {
      console.error(err);
      setResumeData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await resumeAPI.upload(file);
      await fetchResume();
    } catch (err) {
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const resumeTips = [
    'Add a professional summary section',
    'Include quantifiable achievements in experience',
    'List relevant certifications for ATS optimization',
  ];

  return (
    <div className="px-8 lg:px-12 py-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Resume</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Resume <span className="font-serif italic font-normal text-black/60">Upload & Parsing</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Upload & Score */}
        <div className="space-y-8 lg:col-span-1">
          {/* Circular Score */}
          <section className="bg-white border border-black/5 p-6 text-center">
            <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6">Resume Score</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#F5F5F2" strokeWidth="8" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="#1A1A1A" strokeWidth="8" strokeDasharray={`${(score / 100) * 352} 352`} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-[9px] uppercase tracking-widest text-black/40 font-bold">out of 100</span>
              </div>
            </div>
          </section>

          {/* Upload Dropzone */}
          <section className="bg-[#F5F5F2] border-2 border-dashed border-black/20 p-8 text-center relative hover:bg-[#EAE8E2] transition-colors cursor-pointer group">
            <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
            <UploadCloud className="w-8 h-8 mx-auto mb-4 text-black/40 group-hover:text-black transition-colors" />
            <div className="text-sm font-bold mb-1">{uploading ? 'Parsing Resume...' : 'Upload New Resume'}</div>
            <div className="text-[10px] text-black/50 uppercase tracking-widest">PDF or DOCX up to 5MB</div>
          </section>

          {/* Tips */}
          <section className="bg-white border border-black/5 p-6">
            <span className="text-[9px] uppercase tracking-widest font-bold text-black/40 block mb-4">Improvement Tips</span>
            <ul className="space-y-3">
              {resumeTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-[11px] text-black/60 leading-relaxed font-medium">
                  <span className="w-4 h-4 shrink-0 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-[8px] font-bold mt-0.5">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Col - Parsed Data */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-black/5 p-8">
            <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-6 flex items-center gap-2"><FileText className="w-4 h-4" /> Parsed Content</h2>
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-black/5 w-1/3"></div>
                <div className="h-4 bg-black/5 w-full"></div>
                <div className="h-4 bg-black/5 w-2/3"></div>
              </div>
            ) : !resumeData ? (
              <div className="text-center py-12 text-black/40 font-serif italic text-lg">
                No resume data found. Upload a resume to see parsed details here.
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-2">Full Name</div>
                  <div className="text-xl font-serif">{resumeData.name || user?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-2">Skills Extracted</div>
                  <div className="flex flex-wrap gap-2">
                    {(resumeData.skills || []).map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> {s}
                      </span>
                    ))}
                    {(!resumeData.skills || resumeData.skills.length === 0) && <span className="text-sm text-black/40 italic">No skills extracted</span>}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-2">Experience</div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-black/70">
                    {resumeData.experience || 'No experience details extracted.'}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-2">Education</div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-black/70">
                    {resumeData.education || 'No education details extracted.'}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
