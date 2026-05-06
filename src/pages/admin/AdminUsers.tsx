import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Search, User, CheckCircle2, Ban } from 'lucide-react';

const roleColors: Record<string, string> = {
  seeker: 'bg-blue-50 text-blue-700 border-blue-200',
  recruiter: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getUsers();
        setUsers(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await adminAPI.updateUser(user.id, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="px-8 lg:px-12 py-8">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-40 block mb-2">User Management</span>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Platform <span className="font-serif italic font-normal text-black/60">Users</span>
        </h1>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex gap-2">
          {['All', 'Seeker', 'Recruiter', 'Admin'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setRoleFilter(tab)}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                roleFilter === tab ? 'bg-[#1A1A1A] text-white' : 'bg-white text-black border border-black/10 hover:bg-black/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-black/40" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-black/10 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-black/5 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5">
              {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left text-[9px] uppercase tracking-widest font-bold text-black/40 px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-black/5"><td colSpan={6} className="p-4"><div className="h-10 bg-black/5 animate-pulse w-full"></div></td></tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-lg text-black/40 font-serif italic">No users found</td></tr>
            ) : filteredUsers.map(u => {
              const isActive = u.status === 'active';
              return (
                <tr key={u.id} className="border-b border-black/5 hover:bg-[#F5F5F2]/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium flex items-center gap-3">
                    <div className="h-8 w-8 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center font-serif text-sm shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-black/60">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full ${roleColors[u.role] || 'bg-gray-50 text-gray-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      {isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-black/40">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => handleToggleStatus(u)} 
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                        isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
