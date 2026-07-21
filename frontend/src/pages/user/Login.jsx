import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserLogin = () => {
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
      if (data.user.role !== 'student') {
        setError('Tài khoản này không phải là Học sinh!');
        return;
      }
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{animationDelay: '4s'}}></div>

      <div className="w-full max-w-md p-10 rounded-3xl z-10 mx-4 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Xin chào Học viên! 🎓</h2>
          <p className="text-slate-500 text-sm">Đăng nhập để xem lịch học và tài liệu</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
              placeholder="VD: nguyenvan_a" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm backdrop-blur-sm"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all duration-300">
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Chưa có tài khoản? <Link to="/user/register" className="text-sky-600 font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
