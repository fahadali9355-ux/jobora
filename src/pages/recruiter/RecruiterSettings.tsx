import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Building2, Bell, Lock } from 'lucide-react';

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

export default function RecruiterSettings() {
  const { user } = useAuth();
  const [toast, setToast] = useState('');

  // Company Profile
  const [companyName, setCompanyName] = useState(user?.name ?? '');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companySize, setCompanySize] = useState('1-10');
  const [industry, setIndustry] = useState('Technology');

  // Notification Preferences
  const [notifyOnApply, setNotifyOnApply] = useState(true);
  const [shortlistReminders, setShortlistReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Account / Password
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd || !newPwd || !confirmPwd) {
      showToast('Please fill all password fields.');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('New passwords do not match!');
      return;
    }
    // Local state only — backend endpoint to be wired up
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    showToast('Password updated successfully!');
  };

  const notifications = [
    {
      label: 'Email me when someone applies',
      sub: 'Receive an email for every new application',
      checked: notifyOnApply,
      toggle: () => setNotifyOnApply((p) => !p),
    },
    {
      label: 'Email me shortlist reminders',
      sub: 'Remind me to review pending applications',
      checked: shortlistReminders,
      toggle: () => setShortlistReminders((p) => !p),
    },
    {
      label: 'Weekly hiring digest',
      sub: 'A weekly summary of activity on your listings',
      checked: weeklyDigest,
      toggle: () => setWeeklyDigest((p) => !p),
    },
  ];

  return (
    <div className="px-8 lg:px-12 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">
          Configuration
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Recruiter <span className="font-serif italic font-normal text-black/60">Settings</span>
        </h1>
      </header>

      <div className="space-y-8">
        {/* ── Section 1: Company Profile ── */}
        <section className="bg-white border border-black/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/5">
            <div className="w-10 h-10 bg-[#F5F5F2] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-black/60" />
            </div>
            <div>
              <h2 className="font-bold text-base">Company Profile</h2>
              <p className="text-xs text-black/40 mt-0.5">Your public employer brand</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Website</label>
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Company Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className={inputClass}
                >
                  {['1-10', '11-50', '51-200', '201-500', '500+'].map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputClass}
                >
                  {['Technology', 'Finance', 'Healthcare', 'Education', 'Other'].map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-black/5">
              <button className="btn-31" onClick={() => showToast('Company profile saved!')}>
                <span className="text-container">
                  <span className="text">Save Company Profile</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Section 2: Notification Preferences ── */}
        <section className="bg-white border border-black/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/5">
            <div className="w-10 h-10 bg-[#F5F5F2] flex items-center justify-center">
              <Bell className="w-4 h-4 text-black/60" />
            </div>
            <div>
              <h2 className="font-bold text-base">Notification Preferences</h2>
              <p className="text-xs text-black/40 mt-0.5">Control how you get updated</p>
            </div>
          </div>

          <div className="divide-y divide-black/5">
            {notifications.map((n) => (
              <div key={n.label} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                <div>
                  <div className="text-sm font-semibold">{n.label}</div>
                  <div className="text-xs text-black/40 mt-0.5">{n.sub}</div>
                </div>
                <Toggle checked={n.checked} onChange={n.toggle} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Account ── */}
        <section className="bg-white border border-black/5 p-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-black/5">
            <div className="w-10 h-10 bg-[#F5F5F2] flex items-center justify-center">
              <Lock className="w-4 h-4 text-black/60" />
            </div>
            <div>
              <h2 className="font-bold text-base">Account</h2>
              <p className="text-xs text-black/40 mt-0.5">Login credentials and security</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Readonly email */}
            <div>
              <label className={labelClass}>Current Email</label>
              <input
                type="email"
                value={user?.email ?? ''}
                readOnly
                className="w-full p-4 bg-black/5 border border-transparent text-sm text-black/50 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Change Password */}
            <div className="pt-4 border-t border-black/5">
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-black/50 mb-6">
                Change Password
              </h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end border-t border-black/5">
                  <button type="submit" className="btn-31">
                    <span className="text-container">
                      <span className="text">Update Password</span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
