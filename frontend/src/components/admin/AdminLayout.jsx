import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Users, LayoutDashboard, LogOut, ClipboardCheck, School } from 'lucide-react';
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
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg">
            T
          </div>
          <div>
            <h2 className="font-bold text-lg text-white leading-tight">Tutor Admin</h2>
            <p className="text-xs text-slate-500 mt-0.5">Hệ thống quản lý</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-semibold' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
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
