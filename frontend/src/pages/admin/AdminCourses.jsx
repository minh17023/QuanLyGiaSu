import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../../services/course.service';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    status: 'active'
  });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCourse(editingId, formData);
        toast.success('Cập nhật thành công');
      } else {
        await createCourse(formData);
        toast.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      description: course.description || '',
      price: course.price,
      status: course.status
    });
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setConfirmConfig({ isOpen: true, id });
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(confirmConfig.id);
      toast.success('Đã xóa thành công');
      setConfirmConfig({ isOpen: false, id: null });
      fetchCourses();
    } catch (err) {
      toast.error('Lỗi khi xóa khóa học!');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', status: 'active' });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32} /> Quản lý Khóa học / Môn học
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Thêm, sửa, xóa các môn học và cấu hình học phí</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-200 transition-colors"
        >
          <Plus size={20} /> Thêm Khóa học
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider">Tên môn học</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-right">Giá 1 ca (VND)</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-500">Chưa có khóa học nào.</td>
              </tr>
            ) : courses.map(course => (
              <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 text-lg">{course.name}</p>
                  <p className="text-sm text-slate-500 line-clamp-1 mt-1">{course.description}</p>
                </td>
                <td className="py-4 px-6 text-right font-bold text-indigo-600">
                  {Number(course.price).toLocaleString()} đ
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {course.status === 'active' ? 'Hoạt động' : 'Đã đóng'}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => openDeleteConfirm(course.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Sửa Khóa học' : 'Thêm Khóa học mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tên môn học</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" placeholder="VD: Toán lớp 12" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Giá 1 ca (VND)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" placeholder="VD: 100000" required min="0" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mô tả thêm</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" placeholder="Ghi chú về lớp học này..." rows={3}></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Trạng thái</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                  <option value="active">Đang mở (Cho phép đăng ký)</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Hủy bỏ</button>
                <button type="submit" className="flex-1 px-4 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        message="Bạn có chắc chắn muốn xóa khóa học này?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmConfig({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminCourses;
