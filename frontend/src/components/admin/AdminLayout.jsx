import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Users, LayoutDashboard, LogOut, ClipboardCheck, School, GraduationCap } from 'lucide-react';
import { logout } from '../../services/auth.service';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/admin/courses', icon: <BookOpen size={20} />, label: 'Môn học (Khóa)' },
    { path: '/admin/classes', icon: <School size={20} />, label: 'Lớp học' },
    { path: '/admin/schedules', icon: <Calendar size={20} />, label: 'Lịch học' },
    { path: '/admin/attendances', icon: <ClipboardCheck size={20} />, label: 'Điểm danh' },
    { path: '/admin/students', icon: <Users size={20} />, label: 'Học sinh' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 text-zinc-400 flex flex-col shadow-2xl z-20 border-r border-zinc-800/50">
        <div className="p-6 border-b border-zinc-800/80 flex items-center gap-4 relative overflow-hidden">
          {/* Subtle background glow for logo area */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full"></div>
          
          <div className="relative w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/30 ring-1 ring-white/10">
            <GraduationCap size={24} />
          </div>
          <div className="relative z-10">
            <h2 className="font-bold text-lg text-white leading-tight tracking-tight">Cún Meo ADMIN</h2>
            <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase mt-0.5">Hệ thống quản trị</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25 font-semibold translate-x-1' 
                    : 'hover:bg-zinc-900 hover:text-zinc-100 hover:translate-x-1'
                }`
              }
            >
              <div className={({ isActive }) => `${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-rose-400'} transition-colors`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800/80 mb-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-zinc-400 hover:bg-zinc-900 hover:text-rose-400 transition-colors font-medium group"
          >
            <LogOut size={20} className="text-zinc-500 group-hover:text-rose-400 transition-colors" />
            <span>Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
