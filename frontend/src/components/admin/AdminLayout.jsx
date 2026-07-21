import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Users, LayoutDashboard, LogOut, ClipboardCheck, School, GraduationCap, Menu, X as CloseIcon } from 'lucide-react';
import { logout } from '../../services/auth.service';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/admin/courses', icon: <BookOpen size={20} />, label: 'Môn học' },
    { path: '/admin/classes', icon: <School size={20} />, label: 'Lớp học' },
    { path: '/admin/schedules', icon: <Calendar size={20} />, label: 'Lịch học' },
    { path: '/admin/attendances', icon: <ClipboardCheck size={20} />, label: 'Điểm danh' },
    { path: '/admin/students', icon: <Users size={20} />, label: 'Học sinh' },
  ];

  return (
    <div 
      className="flex h-screen font-sans relative overflow-hidden bg-slate-50"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('/loopy-meme.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-white/40 backdrop-blur-lg text-slate-800 flex flex-col shadow-2xl z-40 border-r border-slate-200/50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Mobile close button */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-6 right-4 text-slate-500 hover:text-slate-800"
        >
          <CloseIcon size={24} />
        </button>
        <div className="p-6 border-b border-slate-200/50 flex items-center gap-4 relative overflow-hidden">
          {/* Subtle background glow for logo area */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full"></div>
          
          <div className="relative w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/30 ring-1 ring-white/10">
            <GraduationCap size={24} />
          </div>
          <div className="relative z-10">
            <h2 className="font-bold text-lg text-slate-800 leading-tight tracking-tight">Cún Meo ADMIN</h2>
            <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">Hệ thống quản trị</p>
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
                    : 'hover:bg-white/50 hover:text-rose-600 hover:translate-x-1'
                }`
              }
            >
              <div className={({ isActive }) => `${isActive ? 'text-white' : 'text-slate-500 group-hover:text-rose-600'} transition-colors`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200/50 mb-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-slate-600 hover:bg-white/50 hover:text-rose-600 transition-colors font-medium group"
          >
            <LogOut size={20} className="text-slate-500 group-hover:text-rose-600 transition-colors" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full md:w-[calc(100%-18rem)]">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200/50 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <GraduationCap size={16} />
            </div>
            <h2 className="font-bold text-slate-800 tracking-tight">Cún Meo ADMIN</h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
