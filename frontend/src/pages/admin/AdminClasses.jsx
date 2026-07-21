import React, { useState, useEffect } from 'react';
import { School, Plus, Edit, Trash2, X, Users, UserPlus } from 'lucide-react';
import { getAllClasses, createClass, updateClass, deleteClass } from '../../services/class.service';
import { getAllCourses } from '../../services/course.service';
import { adminEnrollCourse, deleteEnrollment } from '../../services/enrollment.service';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [currentClassId, setCurrentClassId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    course_id: '',
    description: '',
    status: 'active'
  });
  
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewClassData, setViewClassData] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: null, payload: null, message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classData, courseData, studentData] = await Promise.all([
        getAllClasses(),
        getAllCourses(),
        api.get('/users/students')
      ]);
      setClasses(classData);
      setCourses(courseData);
      setStudents(studentData.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateClass(editingId, formData);
        toast.success('Cập nhật thành công');
      } else {
        await createClass(formData);
        toast.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setFormData({
      name: cls.name,
      course_id: cls.course_id,
      description: cls.description || '',
      status: cls.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteClass = (id) => {
    setConfirmConfig({
      isOpen: true,
      type: 'CLASS',
      payload: id,
      message: 'Bạn có chắc chắn muốn xóa lớp học này?'
    });
  };

  const handleConfirmAction = async () => {
    const { type, payload } = confirmConfig;
    if (type === 'CLASS') {
      try {
        await deleteClass(payload);
        toast.success('Đã xóa lớp học');
        fetchData();
      } catch (err) {
        toast.error('Lỗi khi xóa lớp học!');
      }
    } else if (type === 'STUDENT') {
      try {
        await deleteEnrollment(payload);
        toast.success('Đã xóa học sinh khỏi lớp');
        setViewClassData(prev => ({
          ...prev,
          Enrollments: prev.Enrollments.filter(e => e.id !== payload)
        }));
        fetchData();
      } catch (err) {
        toast.error('Có lỗi khi xóa học sinh khỏi lớp.');
      }
    }
    setConfirmConfig({ isOpen: false, type: null, payload: null, message: '' });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      course_id: '', 
      description: '', 
      status: 'active' 
    });
    setIsModalOpen(true);
  };

  const openStudentModal = (cls) => {
    setCurrentClassId(cls.id);
    // Danh sách học sinh ĐÃ ở trong lớp (active hoặc pending)
    const existingIds = (cls.Enrollments || []).map(e => e.User?.id);
    setSelectedStudentIds(existingIds);
    setIsStudentModalOpen(true);
  };

  const toggleStudent = (studentId) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSaveStudents = async (e) => {
    e.preventDefault();
    if (!currentClassId) return;
    
    // Tìm các học sinh MỚI được chọn (chưa có trong class gốc)
    const cls = classes.find(c => c.id === currentClassId);
    const existingIds = (cls.Enrollments || []).map(e => e.User?.id);
    const newStudentIds = selectedStudentIds.filter(id => !existingIds.includes(id));
    
    if (newStudentIds.length === 0) {
      setIsStudentModalOpen(false);
      return;
    }
    
    try {
      await Promise.all(
        newStudentIds.map(studentId => adminEnrollCourse(studentId, currentClassId))
      );
      toast.success(`Đã thêm ${newStudentIds.length} học sinh vào lớp!`);
      setIsStudentModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Có lỗi khi thêm học sinh. Vui lòng thử lại.');
    }
  };

  const handleRemoveStudent = (enrollmentId) => {
    setConfirmConfig({
      isOpen: true,
      type: 'STUDENT',
      payload: enrollmentId,
      message: 'Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?'
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <School className="text-blue-600" size={32} /> Quản lý Lớp học
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Tạo lớp học và quản lý danh sách học sinh của lớp</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-200 transition-colors"
        >
          <Plus size={20} /> Tạo Lớp học
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider">Tên Lớp học</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-center">Sĩ số</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider">Môn gốc (Giá)</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase tracking-wider text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500">Chưa có lớp học nào.</td>
              </tr>
            ) : classes.map(cls => (
              <tr key={cls.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 text-lg">{cls.name}</p>
                  <p className="text-sm text-slate-500 line-clamp-1 mt-1">{cls.description}</p>
                </td>
                <td className="py-4 px-6 text-center">
                  <button 
                    onClick={() => { setViewClassData(cls); setIsViewModalOpen(true); }}
                    className="font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1 mx-auto"
                  >
                    <Users size={16} /> {cls.Enrollments?.length || 0} học sinh
                  </button>
                </td>
                <td className="py-4 px-6 font-medium text-slate-700">
                  <span className="text-blue-600 font-bold">{cls.Course?.name}</span>
                  <br/><span className="text-xs text-slate-500">{Number(cls.Course?.price).toLocaleString()} đ/ca</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    cls.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cls.status === 'active' ? 'Hoạt động' : 'Đã đóng'}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openStudentModal(cls)} className="px-3 py-1.5 bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-1 text-sm">
                      <UserPlus size={16} /> Thêm HS
                    </button>
                    <button onClick={() => handleEdit(cls)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeleteClass(cls.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Sửa Lớp học' : 'Thêm Lớp học mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tên Lớp học</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" placeholder="VD: Lớp Toán 12A" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Chọn Môn học gốc (Khóa học)</label>
                <select value={formData.course_id} onChange={e => setFormData({...formData, course_id: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" required>
                  <option value="" disabled>-- Vui lòng chọn Khóa học --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mô tả thêm</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" placeholder="Lịch học dự kiến, học sinh mục tiêu..." rows={3}></textarea>
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

      {/* Modal Add Students to Class */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Thêm học sinh vào lớp</h2>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
              <input 
                type="text" 
                placeholder="Tìm kiếm theo Tên hoặc SĐT..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-2">
                {students.filter(s => {
                  const searchStr = searchTerm.toLowerCase();
                  return (s.full_name?.toLowerCase().includes(searchStr) || s.username?.toLowerCase().includes(searchStr) || s.phone?.includes(searchTerm));
                }).map(student => {
                  const isChecked = selectedStudentIds.includes(student.id);
                  const isExisting = classes.find(c => c.id === currentClassId)?.Enrollments?.some(e => e.User?.id === student.id);

                  return (
                    <label key={student.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${isChecked ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'} ${isExisting ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        disabled={isExisting}
                        onChange={() => toggleStudent(student.id)} 
                        className="w-5 h-5 text-blue-600 rounded border-slate-300"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{student.full_name || student.username}</p>
                        <p className="text-xs text-slate-500">{student.phone || 'Không SĐT'} {isExisting && <span className="text-green-600 font-bold">(Đã có trong lớp)</span>}</p>
                      </div>
                    </label>
                  );
                })}
                {students.length === 0 && <p className="text-center text-slate-500">Chưa có học sinh nào trong hệ thống.</p>}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
              <button type="button" onClick={() => setIsStudentModalOpen(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50">Hủy</button>
              <button type="button" onClick={handleSaveStudents} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200">
                Lưu danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Students */}
      {isViewModalOpen && viewClassData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Danh sách học sinh</h2>
                <p className="text-sm text-slate-500 mt-1">Lớp: <span className="font-semibold text-blue-600">{viewClassData.name}</span></p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-0 flex-1 overflow-y-auto">
              {viewClassData.Enrollments?.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="mx-auto mb-3 text-slate-300" size={48} />
                  Chưa có học sinh nào trong lớp này.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                    <tr>
                      <th className="py-3 px-6 text-slate-600 font-semibold text-xs uppercase tracking-wider">Họ tên / Username</th>
                      <th className="py-3 px-6 text-slate-600 font-semibold text-xs uppercase tracking-wider">SĐT Phụ huynh</th>
                      <th className="py-3 px-6 text-slate-600 font-semibold text-xs uppercase tracking-wider text-center">Trạng thái</th>
                      <th className="py-3 px-6 text-slate-600 font-semibold text-xs uppercase tracking-wider text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewClassData.Enrollments.map((en) => (
                      <tr key={en.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-6">
                          <p className="font-bold text-slate-800">{en.User?.full_name || en.User?.username}</p>
                          <p className="text-xs text-slate-500">{en.User?.username}</p>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-700">{en.User?.phone || 'Chưa cập nhật'}</td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            en.status === 'active' ? 'bg-green-100 text-green-700' :
                            en.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {en.status === 'active' ? 'Đang học' : en.status === 'pending' ? 'Chờ duyệt' : 'Đã nghỉ'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button 
                            onClick={() => handleRemoveStudent(en.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa khỏi lớp"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        message={confirmConfig.message}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmConfig({ isOpen: false, type: null, payload: null, message: '' })}
      />
    </div>
  );
};

export default AdminClasses;
