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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden font-sans selection:bg-rose-500/30">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-900/40 rounded-full mix-blend-screen filter blur-[150px] opacity-60 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-zinc-800/50 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="w-full max-w-[360px] p-8 rounded-[2rem] z-10 text-zinc-100 mx-4 bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/50 shadow-[0_0_80px_rgba(244,63,94,0.1)] relative">
        <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, white, transparent)' }}></div>
        
        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30 ring-1 ring-white/20">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Hệ Thống Quản Trị</h2>
          <p className="text-zinc-400 text-sm font-medium">Đăng nhập để tiếp tục vào không gian làm việc</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-medium text-center animate-in fade-in zoom-in-95 duration-300">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-medium"
              placeholder="Nhập username của bạn" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Mật khẩu</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 pr-12 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-medium"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full group bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-zinc-600" />
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
