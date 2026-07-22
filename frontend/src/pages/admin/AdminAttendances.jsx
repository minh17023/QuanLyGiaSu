import React, { useState, useEffect } from 'react';
import { getSchedulesByDate, getAttendanceForSchedule, markAttendance } from '../../services/attendance.service';
import { ClipboardCheck, Calendar, Clock, Check, X, AlertCircle, Search } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('vi', vi);

const AdminAttendances = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    studentId: null,
    studentName: '',
    status: '',
    lessonContent: '',
    comments: ''
  });

  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedSchedule) {
      fetchAttendance(selectedSchedule.id);
    } else {
      setAttendanceList([]);
    }
  }, [selectedSchedule]);

  const fetchSchedules = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const data = await getSchedulesByDate(dateStr);
      setSchedules(data);
      if (data.length > 0) {
        setSelectedSchedule(data[0]);
      } else {
        setSelectedSchedule(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async (scheduleId) => {
    setLoading(true);
    try {
      const data = await getAttendanceForSchedule(scheduleId);
      setAttendanceList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkClick = (student, status) => {
    setModalData({
      studentId: student.student_id,
      studentName: student.full_name,
      status: status,
      lessonContent: student.lesson_content || '',
      comments: student.comments || ''
    });
    setIsModalOpen(true);
  };

  const confirmMarkAttendance = async () => {
    if (modalData.status === 'present' && !modalData.lessonContent.trim()) {
      toast.error('Vui lòng nhập nội dung buổi học!');
      return;
    }

    try {
      // Optimistic UI update
      setAttendanceList(prev => prev.map(item => 
        item.student_id === modalData.studentId 
          ? { ...item, attendance_status: modalData.status, lesson_content: modalData.lessonContent, comments: modalData.comments } 
          : item
      ));
      
      await markAttendance(selectedSchedule.id, modalData.studentId, modalData.status, modalData.lessonContent, modalData.comments);
      toast.success('Điểm danh thành công!');
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Lỗi điểm danh!');
      fetchAttendance(selectedSchedule.id); // revert
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar chọn Lịch */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} /> Chọn Ngày Điểm Danh
          </h2>
          <DatePicker 
            selected={selectedDate} 
            onChange={(date) => setSelectedDate(date)}
            locale="vi"
            inline
            className="w-full"
          />
        </div>

        <div className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-sm border border-slate-200 flex-1">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="text-indigo-600" size={24} /> Các Ca Học Hôm Nay
          </h2>
          
          <div className="space-y-3">
            {schedules.length === 0 ? (
              <p className="text-slate-500 text-center py-6 text-sm">Không có ca học nào trong ngày này.</p>
            ) : (
              schedules.map(sched => (
                <button
                  key={sched.id}
                  onClick={() => setSelectedSchedule(sched)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedSchedule?.id === sched.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm shadow-blue-100' 
                      : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-800 mb-1">{sched.Course?.name}</div>
                  <div className="text-sm font-medium text-slate-500 flex justify-between">
                    <span>{sched.title}</span>
                    <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg text-xs">{formatTime(sched.start_time)} - {formatTime(sched.end_time)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Vùng Điểm Danh */}
      <div className="w-full md:w-2/3 bg-white/40 backdrop-blur-lg p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <ClipboardCheck className="text-blue-600" size={32} /> Danh Sách Điểm Danh
            </h1>
            {selectedSchedule && (
              <p className="text-slate-500 mt-2 font-medium">
                Lớp: <span className="text-slate-800">{selectedSchedule.Course?.name}</span> • Ca học: {formatTime(selectedSchedule.start_time)} - {formatTime(selectedSchedule.end_time)}
              </p>
            )}
          </div>
          {selectedSchedule && attendanceList.length > 0 && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Tìm tên hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          )}
        </div>

        {!selectedSchedule ? (
          <div className="text-center py-20 text-slate-400">
            <ClipboardCheck size={48} className="mx-auto mb-4 opacity-50" />
            <p>Vui lòng chọn một ca học ở cột bên trái để bắt đầu điểm danh.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-blue-500">Đang tải danh sách học sinh...</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider">Học sinh</th>
                  <th className="py-4 px-6 text-slate-600 font-bold text-sm uppercase tracking-wider text-center">Trạng thái điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-12 text-center text-slate-500">Lớp học này chưa có học sinh nào đăng ký.</td>
                  </tr>
                ) : attendanceList.filter(item => {
                  const term = searchTerm.toLowerCase();
                  return item.full_name?.toLowerCase().includes(term) || item.phone?.includes(term);
                }).map(item => (
                  <tr key={item.student_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 text-lg">{item.full_name}</div>
                      <div className="text-sm font-medium text-slate-500">{item.phone || 'Không SĐT'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleMarkClick(item, 'present')}
                          className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all ${
                            item.attendance_status === 'present' 
                              ? 'bg-green-100 border-green-500 text-green-700 shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <Check size={20} className={item.attendance_status === 'present' ? 'text-green-600' : ''} />
                          <span className="text-xs font-bold mt-1">Có mặt</span>
                        </button>
                        
                        <button 
                          onClick={() => handleMarkClick(item, 'absent')}
                          className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all ${
                            item.attendance_status === 'absent' 
                              ? 'bg-red-100 border-red-500 text-red-700 shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <X size={20} className={item.attendance_status === 'absent' ? 'text-red-600' : ''} />
                          <span className="text-xs font-bold mt-1">Vắng</span>
                        </button>

                        <button 
                          onClick={() => handleMarkClick(item, 'excused')}
                          className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all ${
                            item.attendance_status === 'excused' 
                              ? 'bg-yellow-100 border-yellow-500 text-yellow-700 shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <AlertCircle size={20} className={item.attendance_status === 'excused' ? 'text-yellow-600' : ''} />
                          <span className="text-xs font-bold mt-1">Có phép</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Điểm danh */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="text-blue-600" size={20} />
                Điểm Danh & Nhập Nội Dung Buổi Học
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold w-24">Học sinh:</span>
                  <span className="font-bold text-slate-800">{modalData.studentName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold w-24">Thời gian:</span>
                  <span className="font-bold text-slate-800">
                    {selectedSchedule ? `${selectedSchedule.start_time.split('T')[0]} lúc ${formatTime(selectedSchedule.start_time)}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold w-24">Trạng thái:</span>
                  <span className={`font-bold ${
                    modalData.status === 'present' ? 'text-green-600' :
                    modalData.status === 'absent' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {modalData.status === 'present' ? 'Có mặt (+1 buổi)' :
                     modalData.status === 'absent' ? 'Vắng mặt' : 'Có phép'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Nội Dung Buổi Học / Chủ Đề {modalData.status === 'present' && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="text" 
                  value={modalData.lessonContent}
                  onChange={(e) => setModalData({...modalData, lessonContent: e.target.value})}
                  placeholder="Ví dụ: Unit 5 - Reading comprehension..."
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Nhận Xét / Bài Tập Về Nhà
                </label>
                <textarea 
                  value={modalData.comments}
                  onChange={(e) => setModalData({...modalData, comments: e.target.value})}
                  placeholder="Hoàn thành bài tập trang 20..."
                  rows="3"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={confirmMarkAttendance}
                className="px-6 py-2 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
              >
                Xác Nhận Điểm Danh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAttendances;
