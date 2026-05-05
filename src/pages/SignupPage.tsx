import { useState, useCallback, FormEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Upload, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';

type Role = 'seeker' | 'recruiter';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<Role>('seeker');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({ name, email, password, role });
      
      if (role === 'seeker' && file) {
        try {
          await resumeAPI.upload(file);
        } catch (resumeErr) {
          console.error("Failed to upload resume", resumeErr);
          // Optional: handle resume upload failure separately
        }
      }

      if (role === 'seeker') navigate('/dashboard/seeker');
      else navigate('/dashboard/recruiter');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const inputClass = "w-full pl-12 pr-4 py-4 bg-transparent border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col">
      <header className="px-8 py-6 border-b border-black/5">
        <span className="font-serif italic text-2xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left editorial */}
        <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 border-r border-black/5 bg-[#F5F5F2] relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-black/5 rounded-full opacity-30" />
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 mb-8 block">Create Account</span>
            <h1 className="text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[0.9]">
              Start Your<br />
              <span className="font-serif italic font-normal text-black/60">Journey.</span>
            </h1>
            <p className="text-black/50 text-sm leading-relaxed max-w-sm mb-12">
              Join thousands of professionals. Let AI connect you with opportunities that truly fit.
            </p>
            <blockquote className="border-l border-black/20 pl-6 text-sm font-serif italic text-black/40 max-w-xs leading-relaxed">
              "Every great career starts with a single step forward."
            </blockquote>
          </div>
        </div>

        {/* Right form */}
        <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12">
          <div className="w-full max-w-md mx-auto">
            <h2 className="lg:hidden text-4xl font-bold tracking-tight mb-2">
              Start Your <span className="font-serif italic font-normal text-black/60">Journey.</span>
            </h2>
            <p className="lg:hidden text-black/50 text-sm mb-8">Create your account</p>

            {/* Role tabs */}
            <div className="mb-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-4">I am a</span>
              <div className="flex border border-black/10">
                {(['seeker', 'recruiter'] as Role[]).map((r) => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-200 ${role === r ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-black/40 hover:text-black/70'}`}>
                    {r === 'seeker' ? 'Job Seeker' : 'Recruiter'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className={inputClass} required />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" className={inputClass} required />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="w-full pl-12 pr-12 py-4 bg-transparent border border-black/10 text-sm placeholder:text-black/25 focus:border-black/40 focus:outline-none transition-colors" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm your password" className={inputClass} required />
                </div>
              </div>

              {error && (
                <div className="text-center">
                  <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                    {error}
                  </p>
                </div>
              )}

              <button type="submit" className="btn-31 w-full" disabled={loading}>
                <span className="text-container"><span className="text">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </span></span>
              </button>
            </form>

            {/* Resume Dropzone for Seekers */}
            {role === 'seeker' && (
              <div className="mt-8">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-3">Upload Resume</span>
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative ${dragActive ? 'border-black/40 bg-[#F5F5F2]' : 'border-black/10 hover:border-black/20'}`}
                  onClick={() => !file && document.getElementById('resume-upload')?.click()}
                >
                  {file ? (
                    <div className="flex items-center gap-3 bg-white px-4 py-2 border border-black/10 rounded-full shadow-sm">
                      <FileText className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-medium max-w-[200px] truncate">{file.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-1 hover:bg-black/5 rounded-full text-black/40 hover:text-red-500 transition-colors ml-2">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-black/20 mb-3" />
                      <p className="text-sm text-black/40 mb-1">Drag & drop your resume here</p>
                      <p className="text-[10px] text-black/25 uppercase tracking-widest">PDF or DOC — Max 5MB</p>
                    </>
                  )}
                  <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-black/10" />
              <span className="text-[10px] uppercase tracking-widest text-black/30 font-medium">or</span>
              <div className="flex-1 h-[1px] bg-black/10" />
            </div>

            {/* OAuth */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-3 py-4 border border-black/10 text-[11px] uppercase tracking-widest font-bold hover:bg-[#F5F5F2] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 py-4 border border-black/10 text-[11px] uppercase tracking-widest font-bold hover:bg-[#F5F5F2] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
            </div>

            <p className="text-center mt-10 text-sm text-black/40">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-[#1A1A1A] font-semibold hover:underline underline-offset-4">Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
