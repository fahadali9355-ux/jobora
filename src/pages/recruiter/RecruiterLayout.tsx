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

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex">
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] text-white min-h-screen fixed left-0 top-0 z-20">
        <div className="px-8 py-8 border-b border-white/5">
          <span className="font-serif italic text-xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
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

      <main className="flex-1 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
