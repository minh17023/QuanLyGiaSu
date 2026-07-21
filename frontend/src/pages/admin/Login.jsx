import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      if (data.user.role !== 'admin') {
        setError('Tài khoản này không có quyền Quản trị viên!');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md p-10 rounded-3xl z-10 text-white mx-4 bg-slate-900/60 backdrop-blur-lg border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase border border-blue-500/30 mb-4">
            Admin Portal
          </span>
          <h2 className="text-3xl font-bold mb-2">Chào mừng Gia sư 👋</h2>
          <p className="text-slate-400 text-sm">Đăng nhập để quản lý lớp học của bạn</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nhập username..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-300">
            Truy cập Hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
