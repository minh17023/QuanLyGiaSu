import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X } from 'lucide-react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/student.service';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Nếu edit mà không nhập pass thì bỏ qua pass
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await updateStudent(editingId, payload);
      } else {
        await createStudent(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      username: student.username,
      full_name: student.full_name || '',
      phone: student.phone || '',
      email: student.email || '',
      password: '' // Không hiện password
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này? Tất cả dữ liệu liên quan sẽ bị ảnh hưởng!')) {
      try {
        await deleteStudent(id);
        fetchData();
      } catch (err) {
        alert('Lỗi khi xóa: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ username: '', full_name: '', phone: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> Quản lý Học sinh
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Thêm mới, cập nhật thông tin và danh bạ của học sinh</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-200 transition-colors"
        >
          <Plus size={20} /> Thêm Học sinh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider">Họ tên Học sinh</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider">SĐT Phụ huynh</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider">Tài khoản (Username)</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-500">Chưa có học sinh nào trong hệ thống.</td>
              </tr>
            ) : students.map(student => (
              <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 text-lg">{student.full_name || 'Chưa cập nhật'}</p>
                  <p className="text-sm text-slate-500 mt-1">{student.email}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                    {student.phone || 'Chưa cập nhật'}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium text-slate-700">
                  {student.username}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Sửa thông tin Học sinh' : 'Tạo mới Học sinh'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tên đăng nhập (Username)</label>
                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={!!editingId} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100" placeholder="VD: nguyenvanA" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mật khẩu {editingId && <span className="text-slate-400 font-normal">(Bỏ trống nếu không đổi)</span>}</label>
                <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder={editingId ? '********' : 'Mặc định là 123456'} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Họ và tên Học sinh</label>
                <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="VD: Nguyễn Văn A" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">SĐT Phụ huynh</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="SĐT để liên lạc phụ huynh" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email (Tùy chọn)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="email@example.com" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Hủy bỏ</button>
                <button type="submit" className="flex-1 px-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors">
                  {editingId ? 'Cập nhật' : 'Tạo Học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
