import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { GraduationCap, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await login(username, password);
      if (data.user.role !== 'admin') {
        setError('Tài khoản này không có quyền Quản trị viên!');
        setIsLoading(false);
        return;
      }
      // Delay slightly for smooth transition feel
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans selection:bg-rose-500/30"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('/meme_loopy1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-[360px] p-8 rounded-[2rem] z-10 text-slate-800 mx-4 bg-white/40 backdrop-blur-lg border border-slate-200/50 shadow-2xl relative">
        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30 ring-1 ring-white/50">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Hệ Thống Quản Trị</h2>
          <p className="text-slate-600 text-sm font-medium">Đăng nhập để tiếp tục vào không gian làm việc</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          {error && (
            <div className="p-4 bg-red-100/80 backdrop-blur-md border border-red-200 text-red-600 rounded-2xl text-sm font-medium text-center animate-in fade-in zoom-in-95 duration-300">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full bg-white/60 border border-slate-200/50 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-medium"
              placeholder="Nhập username của bạn" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-white/60 border border-slate-200/50 rounded-2xl px-5 py-4 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-medium"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full group bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              <>
                Đăng nhập <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
