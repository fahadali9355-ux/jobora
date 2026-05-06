import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Brain, FileBarChart, Settings, Shield } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: Brain, label: 'AI Models', path: '/admin/ai-models' },
  { icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex">
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] text-white min-h-screen fixed left-0 top-0 z-20">
        <div className="px-8 py-8 border-b border-white/5">
          <span className="font-serif italic text-xl cursor-pointer" onClick={() => navigate('/')}>Jobora</span>
          <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block mt-1">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
              end={path === '/admin'}
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
              <Shield className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <div className="text-xs font-semibold">System Admin</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Root Access</div>
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
