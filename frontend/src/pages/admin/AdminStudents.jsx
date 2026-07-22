import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, User as UserIcon, BookOpen, FileText, CreditCard, Check, Trash, Eye, EyeOff } from 'lucide-react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/student.service';
import { getTestScoresByStudent, createTestScore, deleteTestScore } from '../../services/testScore.service';
import { getPaymentsByStudent, createPayment, deletePayment } from '../../services/payment.service';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Data cho các tab
  const [enrollments, setEnrollments] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [testScores, setTestScores] = useState([]);
  const [payments, setPayments] = useState([]);

  // Form Data
  const [profileData, setProfileData] = useState({ username: '', full_name: '', phone: '', email: '', password: '' });
  const [newScore, setNewScore] = useState({ date: '', test_type: '', score: '', notes: '' });
  const [newPayment, setNewPayment] = useState({ payment_date: '', amount: '', note: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: null, payload: null, message: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openStudentModal = async (student) => {
    setSelectedStudent(student);
    setProfileData({
      username: student.username,
      full_name: student.full_name || '',
      phone: student.phone || '',
      email: student.email || '',
      password: ''
    });
    setActiveTab('profile');
    setIsModalOpen(true);
    await fetchStudentDetails(student.id);
  };

  const openAddStudentModal = () => {
    setSelectedStudent(null);
    setProfileData({ username: '', full_name: '', phone: '', email: '', password: '' });
    setActiveTab('profile');
    setIsModalOpen(true);
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      // Fetch Enrollments
      const enrollRes = await api.get(`/enrollments/student/${studentId}`);
      setEnrollments(enrollRes.data);
      // Fetch Attendances
      const attenRes = await api.get(`/attendances/student/${studentId}`);
      setAttendances(attenRes.data);
      // Fetch Test Scores
      const scoresRes = await getTestScoresByStudent(studentId);
      setTestScores(scoresRes);
      // Fetch Payments
      const payRes = await getPaymentsByStudent(studentId);
      setPayments(payRes);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết học sinh:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        const payload = { ...profileData };
        if (!payload.password) delete payload.password;
        await updateStudent(selectedStudent.id, payload);
        toast.success('Cập nhật thành công');
      } else {
        await createStudent(profileData);
        toast.success('Thêm mới thành công');
        setIsModalOpen(false);
      }
      fetchStudents();
    } catch (err) {
      toast.error('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddTestScore = async (e) => {
    e.preventDefault();
    try {
      await createTestScore({ ...newScore, student_id: selectedStudent.id });
      setNewScore({ date: '', test_type: '', score: '', notes: '' });
      const scoresRes = await getTestScoresByStudent(selectedStudent.id);
      setTestScores(scoresRes);
      toast.success('Đã thêm điểm thành công');
    } catch (err) {
      toast.error('Lỗi khi thêm điểm');
    }
  };

  const handleDeleteTestScore = (id) => {
    setConfirmConfig({
      isOpen: true,
      type: 'TEST_SCORE',
      payload: id,
      message: 'Xóa điểm này?'
    });
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      await createPayment({ ...newPayment, student_id: selectedStudent.id });
      setNewPayment({ payment_date: '', amount: '', note: '' });
      const payRes = await getPaymentsByStudent(selectedStudent.id);
      setPayments(payRes);
      toast.success('Đã thêm thanh toán thành công');
    } catch (err) {
      toast.error('Lỗi khi thêm thanh toán');
    }
  };

  const handleDeletePayment = (id) => {
    setConfirmConfig({
      isOpen: true,
      type: 'PAYMENT',
      payload: id,
      message: 'Xóa giao dịch này?'
    });
  };

  const handleDeleteStudent = (id) => {
    setConfirmConfig({
      isOpen: true,
      type: 'STUDENT',
      payload: id,
      message: 'Xóa học sinh này và toàn bộ dữ liệu liên quan?'
    });
  };

  const executeConfirmAction = async () => {
    const { type, payload } = confirmConfig;
    if (type === 'TEST_SCORE') {
      try {
        await deleteTestScore(payload);
        const scoresRes = await getTestScoresByStudent(selectedStudent.id);
        setTestScores(scoresRes);
        toast.success('Đã xóa điểm');
      } catch (err) {
        toast.error('Lỗi khi xóa điểm');
      }
    } else if (type === 'PAYMENT') {
      try {
        await deletePayment(payload);
        const payRes = await getPaymentsByStudent(selectedStudent.id);
        setPayments(payRes);
        toast.success('Đã xóa giao dịch');
      } catch (err) {
        toast.error('Lỗi khi xóa');
      }
    } else if (type === 'STUDENT') {
      try {
        await deleteStudent(payload);
        fetchStudents();
        toast.success('Đã xóa học sinh');
      } catch (err) {
        toast.error('Lỗi khi xóa');
      }
    }
    setConfirmConfig({ isOpen: false, type: null, payload: null, message: '' });
  };

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> Quản lý Học sinh
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Hồ sơ chi tiết, điểm danh, điểm kiểm tra và học phí</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
          <input 
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
          <button 
            onClick={openAddStudentModal} 
            className="w-full md:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-200 transition-colors whitespace-nowrap"
          >
            <Plus size={20} /> Thêm Học sinh
          </button>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase">Học sinh</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase">Email</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase">SĐT Phụ huynh</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase text-center">Điểm KT gần nhất</th>
              <th className="py-4 px-6 text-slate-600 font-semibold text-sm uppercase text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.filter(s => {
              const term = searchTerm.toLowerCase();
              return s.full_name?.toLowerCase().includes(term) || 
                     s.username?.toLowerCase().includes(term) || 
                     s.phone?.includes(term) || 
                     s.email?.toLowerCase().includes(term);
            }).map(student => {
              const latestScore = student.TestScores && student.TestScores.length > 0 ? student.TestScores[0] : null;
              return (
              <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 text-lg">{student.full_name || 'Chưa cập nhật'}</p>
                  <p className="text-sm text-slate-500 mt-1"> {student.username}</p>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">
                  {student.email || <span className="text-slate-400 italic">Chưa cập nhật</span>}
                </td>
                <td className="py-4 px-6">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                    {student.phone || 'Chưa cập nhật'}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  {latestScore ? (
                    <div>
                      <p className="font-bold text-orange-600 text-lg">{latestScore.score}</p>
                      <p className="text-xs text-slate-500">{latestScore.test_type} ({new Date(latestScore.date).toLocaleDateString('vi-VN')})</p>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openStudentModal(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                      Xem Chi Tiết
                    </button>
                    <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {selectedStudent ? selectedStudent.full_name?.charAt(0) || 'U' : 'N'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedStudent ? selectedStudent.full_name : 'Thêm Học sinh Mới'}</h2>
                  {selectedStudent && <p className="text-sm text-slate-500">SĐT: {selectedStudent.phone || 'N/A'}</p>}
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tabs (Chỉ hiện khi đang xem chi tiết học sinh) */}
            {selectedStudent && (
              <div className="flex overflow-x-auto border-b border-slate-200 px-6 mt-4 gap-6 scrollbar-hide">
                {[
                  { id: 'profile', icon: UserIcon, label: 'Hồ Sơ & Lớp Học' },
                  { id: 'attendance', icon: BookOpen, label: 'Nhật Ký & Điểm Danh' },
                  { id: 'scores', icon: FileText, label: 'Điểm Kiểm Tra' },
                  { id: 'payments', icon: CreditCard, label: 'Lịch Sử Đóng Học Phí' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    <tab.icon size={18} /> {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Nội dung Tabs có thể cuộn được */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              
              {/* TAB 1: HỒ SƠ & LỚP HỌC */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><UserIcon size={20} className="text-blue-600"/> Thông Tin Cá Nhân</h3>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Tên đăng nhập</label>
                        <input type="text" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} disabled={!!selectedStudent} className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 outline-none focus:border-blue-500" required />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Họ và tên</label>
                        <input type="text" value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" required />
                      </div>
                      {!selectedStudent && (
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1">Mật khẩu</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              value={profileData.password} 
                              onChange={e => setProfileData({...profileData, password: e.target.value})} 
                              className="w-full border border-slate-200 rounded-xl px-4 py-2 pr-10 outline-none focus:border-blue-500" 
                              placeholder="Khởi tạo mật khẩu" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1">SĐT Phụ huynh</label>
                          <input 
                            type="tel" 
                            pattern="0[0-9]{9}" 
                            title="Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0" 
                            value={profileData.phone} 
                            onChange={e => setProfileData({...profileData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10)})} 
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1">Email</label>
                          <input 
                            type="email" 
                            value={profileData.email} 
                            onChange={e => setProfileData({...profileData, email: e.target.value})} 
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" 
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Lưu Thông Tin</button>
                    </form>
                  </div>

                  {selectedStudent && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={20} className="text-emerald-600"/> Các Lớp Đang Học</h3>
                      {enrollments.length === 0 ? (
                        <p className="text-slate-500 text-sm">Chưa đăng ký lớp nào.</p>
                      ) : (
                        <div className="space-y-3">
                          {enrollments.map(en => (
                            <div key={en.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                              <div>
                                <p className="font-bold text-slate-800">{en.Class?.Course?.name}</p>
                                <p className="text-sm text-slate-500">Mã lớp: {en.Class?.id}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${en.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {en.status === 'active' ? 'Đang học' : 'Chờ duyệt'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ĐIỂM DANH */}
              {activeTab === 'attendance' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2"><Check size={20} className="text-blue-600"/> Lịch sử Buổi học & Điểm danh</h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="pb-3 px-4 font-medium">Ngày học</th>
                        <th className="pb-3 px-4 font-medium">Lớp học</th>
                        <th className="pb-3 px-4 font-medium">Nội dung học</th>
                        <th className="pb-3 px-4 font-medium">Nhận xét</th>
                        <th className="pb-3 px-4 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendances.length === 0 ? <tr><td colSpan="5" className="py-6 text-center text-slate-500">Chưa có dữ liệu</td></tr> : 
                        attendances.map(a => (
                          <tr key={a.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                            <td className="py-4 px-4 font-medium">{new Date(a.Schedule?.start_time).toLocaleDateString('vi-VN')}</td>
                            <td className="py-4 px-4">{a.Schedule?.Class?.Course?.name}</td>
                            <td className="py-4 px-4 text-slate-600 max-w-[200px] truncate" title={a.lesson_content}>{a.lesson_content || '-'}</td>
                            <td className="py-4 px-4 text-slate-600 max-w-[200px] truncate" title={a.comments}>{a.comments || '-'}</td>
                            <td className="py-4 px-4">
                              {a.status === 'present' ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Có mặt</span> :
                               a.status === 'absent' ? <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Vắng mặt</span> :
                               a.status === 'excused' ? <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">Có phép</span> :
                               <span className="text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded">Chưa điểm danh</span>}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: ĐIỂM KIỂM TRA */}
              {activeTab === 'scores' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><FileText size={20} className="text-orange-500"/> Nhập Điểm Kiểm Tra Mới</h3>
                    <form onSubmit={handleAddTestScore} className="flex flex-col md:flex-row md:flex-wrap gap-4 md:items-end">
                      <div className="w-full md:flex-1 md:min-w-[150px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Ngày thi</label>
                        <input type="date" required value={newScore.date} onChange={e => setNewScore({...newScore, date: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" />
                      </div>
                      <div className="w-full md:flex-[2] md:min-w-[200px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Loại bài (15p, Giữa kỳ...)</label>
                        <input type="text" required value={newScore.test_type} onChange={e => setNewScore({...newScore, test_type: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="VD: Giữa kỳ IELTS" />
                      </div>
                      <div className="w-full md:flex-1 md:min-w-[100px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Điểm số</label>
                        <input type="number" step="0.1" max="10" required value={newScore.score} onChange={e => setNewScore({...newScore, score: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="0-10" />
                      </div>
                      <div className="w-full md:flex-[3] md:min-w-[300px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Nhận xét (Tùy chọn)</label>
                        <input type="text" value={newScore.notes} onChange={e => setNewScore({...newScore, notes: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="Ghi chú chi tiết..." />
                      </div>
                      <button type="submit" className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">Lưu Điểm</button>
                    </form>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-sm text-slate-500">
                          <th className="pb-3 px-4 font-medium">Ngày</th>
                          <th className="pb-3 px-4 font-medium">Loại Bài</th>
                          <th className="pb-3 px-4 font-medium">Điểm</th>
                          <th className="pb-3 px-4 font-medium">Nhận xét</th>
                          <th className="pb-3 px-4 font-medium text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testScores.length === 0 ? <tr><td colSpan="5" className="py-6 text-center text-slate-500">Chưa có bài kiểm tra nào</td></tr> :
                          testScores.map(ts => (
                            <tr key={ts.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                              <td className="py-4 px-4 font-medium">{new Date(ts.date).toLocaleDateString('vi-VN')}</td>
                              <td className="py-4 px-4">{ts.test_type}</td>
                              <td className="py-4 px-4 font-bold text-orange-600 text-lg">{ts.score}</td>
                              <td className="py-4 px-4 text-slate-600">{ts.notes || '-'}</td>
                              <td className="py-4 px-4 text-center">
                                <button onClick={() => handleDeleteTestScore(ts.id)} className="text-red-400 hover:text-red-600"><Trash size={16}/></button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: LỊCH SỬ ĐÓNG HỌC PHÍ */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  {/* Summary Bar */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="bg-white flex-1 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                      <p className="text-slate-500 font-medium text-sm">Buổi "Có mặt"</p>
                      <p className="text-2xl font-bold text-slate-800">{attendances.filter(a => a.status === 'present').length} buổi</p>
                    </div>
                    <div className="bg-white flex-1 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                      <p className="text-slate-500 font-medium text-sm">Đã Thanh Toán</p>
                      <p className="text-2xl font-bold text-emerald-600">{formatMoney(payments.reduce((sum, p) => sum + parseFloat(p.amount), 0))}</p>
                    </div>
                    <div className="bg-white flex-1 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                      <p className="text-slate-500 font-medium text-sm">Còn Nợ</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatMoney(
                          attendances.filter(a => a.status === 'present').reduce((sum, a) => sum + parseFloat(a.Schedule?.Class?.Course?.price || 0), 0) 
                          - payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={20} className="text-emerald-600"/> Ghi Nhận Đợt Thanh Toán</h3>
                    <form onSubmit={handleAddPayment} className="flex flex-col md:flex-row md:flex-wrap gap-4 md:items-end">
                      <div className="w-full md:flex-1 md:min-w-[150px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Ngày đóng tiền</label>
                        <input type="date" required value={newPayment.payment_date} onChange={e => setNewPayment({...newPayment, payment_date: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" />
                      </div>
                      <div className="w-full md:flex-[2] md:min-w-[200px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Số tiền đóng (VNĐ)</label>
                        <input type="number" required value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="VD: 500000" />
                      </div>
                      <div className="w-full md:flex-[3] md:min-w-[300px]">
                        <label className="text-sm font-semibold text-slate-700 block mb-1">Ghi chú (Tùy chọn)</label>
                        <input type="text" value={newPayment.note} onChange={e => setNewPayment({...newPayment, note: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" placeholder="VD: CK Vietcombank tháng 10" />
                      </div>
                      <button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">Lưu Giao Dịch</button>
                    </form>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-sm text-slate-500">
                          <th className="pb-3 px-4 font-medium">Ngày Đóng</th>
                          <th className="pb-3 px-4 font-medium">Số Tiền</th>
                          <th className="pb-3 px-4 font-medium">Ghi Chú</th>
                          <th className="pb-3 px-4 font-medium text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? <tr><td colSpan="4" className="py-6 text-center text-slate-500">Chưa có giao dịch</td></tr> :
                          payments.map(p => (
                            <tr key={p.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                              <td className="py-4 px-4 font-medium">{new Date(p.payment_date).toLocaleDateString('vi-VN')}</td>
                              <td className="py-4 px-4 font-bold text-emerald-600 text-lg">{formatMoney(p.amount)}</td>
                              <td className="py-4 px-4 text-slate-600">{p.note || '-'}</td>
                              <td className="py-4 px-4 text-center">
                                <button onClick={() => handleDeletePayment(p.id)} className="text-red-400 hover:text-red-600"><Trash size={16}/></button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        message={confirmConfig.message}
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmConfig({ isOpen: false, type: null, payload: null, message: '' })}
      />
    </div>
  );
};

export default AdminStudents;
