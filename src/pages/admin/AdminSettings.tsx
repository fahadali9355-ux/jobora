import { useState } from 'react';
import { Check, Settings, Brain, Shield } from 'lucide-react';

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-8 right-8 bg-[#1A1A1A] text-white px-6 py-4 shadow-xl flex items-center gap-3 z-50 animate-[slideUp_0.3s_ease-out]">
      <Check className="w-5 h-5 text-emerald-400" />
      <span className="text-[11px] uppercase tracking-widest font-bold">{message}</span>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#1A1A1A]' : 'bg-black/20'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

const inputClass =
  'w-full p-4 bg-[#F5F5F2] border border-black/10 text-sm focus:outline-none focus:border-black transition-colors';
const labelClass = 'text-[10px] uppercase tracking-widest font-bold text-black/60 block mb-2';

export default function AdminSettings() {
  const [toast, setToast] = useState('');

  // General
  const [platformName, setPlatformName] = useState('Jobora');
  const [platformEmail, setPlatformEmail] = useState('admin@jobora.com');
  const [maxFileSize, setMaxFileSize] = useState('5MB');

  // AI
  const [matchThreshold, setMatchThreshold] = useState(70);
  const [maxCandidates, setMaxCandidates] = useState(50);
  const [autoRanking, setAutoRanking] = useState(true);

  // Security
  const [tokenExpiry, setTokenExpiry] = useState('24 hours');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="px-8 lg:px-12 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">
          Configuration
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          System <span className="font-serif italic font-normal text-black/60">Settings</span>
        </h1>
      </header>

      <div className="space-y-8">
        {/* ── Section 1: General ── */}
        <section className="bg-white border border-black/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/5">
            <div className="w-10 h-10 bg-[#F5F5F2] flex items-center justify-center">
              <Settings className="w-4 h-4 text-black/60" />
            </div>
            <div>
              <h2 className="font-bold text-base">General Settings</h2>
              <p className="text-xs text-black/40 mt-0.5">Basic platform configuration</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Platform Email</label>
                <input
                  type="email"
                  value={platformEmail}
                  onChange={(e) => setPlatformEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Max Resume File Size</label>
              <select
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
                className={inputClass}
              >
                {['2MB', '5MB', '10MB'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="pt-4 flex justify-end border-t border-black/5">
              <button
                className="btn-31"
                onClick={() => showToast('General settings saved!')}
              >
                <span className="text-container">
                  <span className="text">Save General Settings</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Section 2: AI Configuration ── */}
        <section className="bg-white border border-black/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/5">
            <div className="w-10 h-10 bg-[#F5F5F2] flex items-center justify-center">
              <Brain className="w-4 h-4 text-black/60" />
            </div>
            <div>
              <h2 className="font-bold text-base">AI Configuration</h2>
              <p className="text-xs text-black/40 mt-0.5">Tune your matching engine</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={labelClass + ' mb-0'}>Match Score Threshold</label>
                <span className="text-2xl font-bold tracking-tight">{matchThreshold}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-[#EAE8E2] rounded-none appearance-none cursor-pointer accent-[#1A1A1A]"
              />
              <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-black/30 mt-1">
                <span>0</span><span>100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Max Candidates Per Job</label>
                <input
                  type="number"
                  min={1}
                  value={maxCandidates}
                  onChange={(e) => setMaxCandidates(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F5F5F2] border border-black/10">
                <div>
                  <div className={labelClass + ' mb-0.5'}>Auto-Ranking</div>
                  <div className="text-xs text-black/50">
                    Automatically rank candidates by match score
                  </div>
                </div>
                <Toggle checked={autoRanking} onChange={() => setAutoRanking((p) => !p)} />
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-black/5">
              <button className="btn-31" onClick={() => showToast('AI settings saved!')}>
                <span className="text-container">
                  <span className="text">Save AI Settings</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Section 3: Security ── */}
        <section className="bg-white border border-black/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/5">
            <div className="w-10 h-10 bg-[#F5F5F2] flex items-center justify-center">
              <Shield className="w-4 h-4 text-black/60" />
            </div>
            <div>
              <h2 className="font-bold text-base">Security</h2>
              <p className="text-xs text-black/40 mt-0.5">Access control and authentication</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>JWT Token Expiry</label>
                <select
                  value={tokenExpiry}
                  onChange={(e) => setTokenExpiry(e.target.value)}
                  className={inputClass}
                >
                  {['1 hour', '24 hours', '7 days'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Max Login Attempts</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-black/5">
              <button className="btn-31" onClick={() => showToast('Security settings saved!')}>
                <span className="text-container">
                  <span className="text">Save Security Settings</span>
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
