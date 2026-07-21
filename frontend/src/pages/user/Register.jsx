import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '', password: '', full_name: '', email: '', phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ ...formData, role: 'student' });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/user/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md p-8 rounded-3xl z-10 mx-4 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl my-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký Học viên mới ✨</h2>
          <p className="text-slate-500 text-sm">Tạo tài khoản để bắt đầu học tập</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
            <input type="text" name="full_name" className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Nguyễn Văn A" onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Tên đăng nhập</label>
            <input type="text" name="username" className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="nguyenvan_a" onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
            <input type="password" name="password" className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input type="email" name="email" className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="email@example.com" onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
            <input type="tel" name="phone" className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="0987654321" onChange={handleChange} />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-semibold py-3 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all mt-4">
            Đăng ký ngay
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Đã có tài khoản? <Link to="/user/login" className="text-sky-600 font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
