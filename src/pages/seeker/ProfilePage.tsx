import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, X } from 'lucide-react';
// PATCH /api/auth/profile endpoint to be implemented on backend

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to PATCH /api/auth/profile
    setStatusMsg({ text: 'Saving...', type: 'info' });
    setTimeout(() => {
      setStatusMsg({ text: 'Profile saved successfully.', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    }, 1000);
  };

  return (
    <div className="px-8 lg:px-12 py-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">Account</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Edit <span className="font-serif italic font-normal text-black/60">Profile</span>
        </h1>
      </header>

      <div className="bg-white border border-black/5 p-8">
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-black/5">
          <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white text-3xl font-serif">
            {name ? name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
          </div>
          <div>
            <div className="text-xl font-bold">{name || 'User'}</div>
            <div className="text-sm text-black/40">{user?.email || 'email@example.com'}</div>
          </div>
        </div>

        {statusMsg.text && (
          <div className={`mb-6 p-4 text-sm font-medium border ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/60 block mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-[#F5F5F2] border border-black/10 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/60 block mb-2">Email Address</label>
              <input type="email" value={user?.email || ''} readOnly className="w-full p-4 bg-black/5 border border-transparent text-sm text-black/50 cursor-not-allowed focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60 block mb-2">Bio / Summary</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell recruiters about yourself..." className="w-full p-4 bg-[#F5F5F2] border border-black/10 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60 block mb-2">Skills (Type and press Enter)</label>
            <div className="p-4 bg-[#F5F5F2] border border-black/10 flex flex-wrap gap-2 items-center focus-within:border-black transition-colors">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-white border border-black/10 text-[11px] font-bold flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-black/40 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="Add a skill..." className="bg-transparent border-none focus:outline-none text-sm min-w-[120px] flex-1" />
            </div>
          </div>

          <div className="pt-6 border-t border-black/5 flex justify-end">
            <button type="submit" className="btn-31">
              <span className="text-container"><span className="text">Save Changes</span></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
