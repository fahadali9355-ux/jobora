import { useState } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GitBranch, BarChart3, Settings, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/recruiter' },
  { icon: PlusCircle, label: 'Post a Job', path: '/dashboard/recruiter/post-job' },
  { icon: Users, label: 'Candidates', path: '/dashboard/recruiter/candidates' },
  { icon: GitBranch, label: 'ATS Pipeline', path: '/dashboard/recruiter/ats' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/recruiter/analytics' },
  { icon: Settings, label: 'Settings', path: '/dashboard/recruiter/settings' },
];

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`flex flex-col w-64 bg-[#1A1A1A] text-white min-h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between">
          <span className="font-serif italic text-xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
              onClick={() => setIsSidebarOpen(false)}
              end={path === '/dashboard/recruiter'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-widest font-bold transition-all duration-200 ${
                  isActive ? 'bg-white text-black rounded-sm' : 'text-white/50 hover:text-white/80'
                }`
              }
            >
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-8 py-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <div className="text-xs font-semibold">{user?.name || 'Recruiter'}</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Recruiter</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-black/5 sticky top-0 z-30">
          <span className="font-serif italic text-xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
          <div className="z-30 text-black">
            <input type="checkbox" id="recruiter-checkbox" className="menu-checkbox" checked={isSidebarOpen} onChange={(e) => setIsSidebarOpen(e.target.checked)} />
            <label htmlFor="recruiter-checkbox" className="toggle">
              <div className="bar bar--top"></div>
              <div className="bar bar--middle"></div>
              <div className="bar bar--bottom"></div>
            </label>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
