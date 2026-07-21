import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getAllSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../services/schedule.service';
import { getAllClasses } from '../../services/class.service';
import api from '../../services/api';

registerLocale('vi', vi);

const locales = {
  'vi': vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AdminSchedules = () => {
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [scheduleType, setScheduleType] = useState('class'); // 'class' hoặc 'individual'
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    class_id: '',
    start_time: new Date(),
    end_time: new Date(new Date().setHours(new Date().getHours() + 1)),
    status: 'scheduled',
    lesson_notes: ''
  });
  
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scheduleData, classData, studentData] = await Promise.all([
        getAllSchedules(),
        getAllClasses(),
        api.get('/users/students')
      ]);
      setClasses(classData);
      setStudents(studentData.data);
      
      const calendarEvents = scheduleData.map(sched => ({
        id: sched.id,
        title: `${sched.Class?.name || 'Lớp học'} (${format(new Date(sched.start_time), 'HH:mm')} - ${format(new Date(sched.end_time), 'HH:mm')})`,
        start: new Date(sched.start_time),
        end: new Date(sched.end_time),
        status: sched.status,
        originalData: sched
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEventId(null);
    setScheduleType('class');
    setSelectedStudentIds([]);
    
    const defaultStart = new Date(start);
    defaultStart.setHours(8, 0, 0, 0);
    const defaultEnd = new Date(start);
    defaultEnd.setHours(9, 30, 0, 0);

    setFormData({
      title: '',
      class_id: classes.length > 0 ? classes[0].id : '',
      start_time: defaultStart,
      end_time: defaultEnd,
      status: 'scheduled',
      lesson_notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    const data = event.originalData;
    setSelectedEventId(data.id);
    setFormData({
      title: data.title,
      class_id: data.class_id,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      status: data.status,
      lesson_notes: data.lesson_notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEventId) {
        await updateSchedule(selectedEventId, formData);
      } else {
        const payload = { ...formData };
        if (scheduleType === 'individual') {
          payload.student_ids = selectedStudentIds;
        }
        await createSchedule(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!selectedEventId) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch này? (Thao tác này cũng xóa luôn danh sách điểm danh của ca học)')) {
      try {
        await deleteSchedule(selectedEventId);
        setIsModalOpen(false);
        fetchData();
      } catch (err) {
        alert('Lỗi khi xóa!');
      }
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6'; 
    if (event.status === 'completed') backgroundColor = '#10b981';
    if (event.status === 'cancelled') backgroundColor = '#ef4444'; 
    return { style: { backgroundColor, borderRadius: '8px', border: 'none', color: 'white', padding: '2px 8px', fontSize: '0.85rem' } };
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <CalendarIcon className="text-blue-600" size={32} /> Lịch giảng dạy
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Quản lý và xếp lịch theo Lớp hoặc Học sinh lẻ (Nhấp kéo thả trên lịch để thêm mới)</p>
        </div>
        <button 
          onClick={() => handleSelectSlot({ start: new Date(), end: new Date(new Date().setHours(new Date().getHours() + 1)) })} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-200 transition-colors"
        >
          <Plus size={20} /> Xếp lịch mới
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" style={{ height: '1000px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup={true}
          eventPropGetter={eventStyleGetter}
          culture="vi"
          messages={{
            next: "Tiếp",
            previous: "Trước",
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            agenda: "Lịch trình",
            showMore: total => `+${total} lịch khác`
          }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{selectedEventId ? 'Chi tiết Lịch học' : 'Xếp lịch mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {!selectedEventId && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">Xếp lịch cho</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="scheduleType" checked={scheduleType === 'class'} onChange={() => setScheduleType('class')} className="text-blue-600" />
                      <span>Cả lớp học</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="scheduleType" checked={scheduleType === 'individual'} onChange={() => setScheduleType('individual')} className="text-blue-600" />
                      <span>Học sinh lẻ (Ghép nhóm)</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Lớp học gốc</label>
                <select 
                  value={formData.class_id} 
                  onChange={e => setFormData({...formData, class_id: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  required
                >
                  <option value="" disabled>-- Chọn lớp học --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({Number(c.Course?.price).toLocaleString()}đ/ca)</option>)}
                </select>
                <p className="text-xs text-slate-500">Giá của môn học này sẽ được dùng để tính tiền học phí cho ca này.</p>
              </div>

              {!selectedEventId && scheduleType === 'individual' && (
                <div className="space-y-2 border border-slate-200 p-4 rounded-xl">
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Chọn học sinh tham gia ca này:</label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {students.map(s => (
                      <label key={s.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                        <input type="checkbox" checked={selectedStudentIds.includes(s.id)} onChange={() => toggleStudent(s.id)} className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                        <span className="text-sm font-medium">{s.full_name || s.username} ({s.phone || 'Không SĐT'})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tên ca học (Nội dung)</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" placeholder="VD: Ca Sáng - Ôn tập chương 1" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-semibold text-slate-700">Thời gian Bắt đầu</label>
                  <DatePicker 
                    selected={formData.start_time} 
                    onChange={(date) => setFormData({...formData, start_time: date})}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    locale="vi"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-semibold text-slate-700">Thời gian Kết thúc</label>
                  <DatePicker 
                    selected={formData.end_time} 
                    onChange={(date) => setFormData({...formData, end_time: date})}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    locale="vi"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Trạng thái</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="scheduled">Đã xếp lịch (Xanh lam)</option>
                  <option value="completed">Đã hoàn thành (Xanh lá)</option>
                  <option value="cancelled">Đã hủy (Đỏ)</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-between gap-3 sticky bottom-0 bg-white border-t border-slate-100 mt-4 p-2">
                {selectedEventId ? (
                  <button type="button" onClick={handleDelete} className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors">
                    <Trash2 size={20} />
                  </button>
                ) : <div />}
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Hủy</button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    {selectedEventId ? 'Cập nhật' : 'Lưu lịch'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;
