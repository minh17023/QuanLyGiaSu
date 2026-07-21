import React, { useState, useEffect } from 'react';
import { getAllCourses } from '../../services/course.service';
import { enrollCourse, getMyEnrollments } from '../../services/enrollment.service';
import { Book, GraduationCap, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';

const UserDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        getAllCourses(),
        getMyEnrollments()
      ]);
      setCourses(coursesData);
      setMyEnrollments(enrollmentsData);
    } catch (err) {
      console.error(err);
      if(err.response?.status === 401) navigate('/user/login');
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await enrollCourse(courseId);
      alert(res.message);
      fetchData(); // Refresh list to show pending status
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi đăng ký');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  // Lọc trạng thái hiển thị trên thẻ Khóa học
  const getEnrollmentStatus = (courseId) => {
    const enroll = myEnrollments.find(e => e.course_id === courseId);
    if (!enroll) return null;
    return enroll.status;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xl">
            <GraduationCap size={28} />
            <span>TutorEdu</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('all')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'all' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'}`}
              >
                Khám phá
              </button>
              <button 
                onClick={() => setActiveTab('my')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'my' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'}`}
              >
                Lớp của tôi
              </button>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium transition-colors ml-4">
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 animate-in fade-in">
        <div className="mb-10 text-center mt-6">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            {activeTab === 'all' ? 'Khám phá Khóa học 🚀' : 'Khóa học của tôi 🎓'}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {activeTab === 'all' 
              ? 'Lựa chọn các khóa học phù hợp để nâng cao kiến thức và đạt kết quả tốt nhất.' 
              : 'Theo dõi các khóa học bạn đang tham gia.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'all' && courses.map(course => {
            const status = getEnrollmentStatus(course.id);
            return (
              <div key={course.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-2 transition-all duration-300 group flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform group-hover:bg-sky-500 group-hover:text-white">
                  <Book size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{course.name}</h3>
                <p className="text-slate-500 text-sm mb-8 line-clamp-3 flex-1">{course.description}</p>
                
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xl font-extrabold text-sky-600">{Number(course.price).toLocaleString('vi-VN')}đ</span>
                  
                  {!status && (
                    <button onClick={() => handleEnroll(course.id)} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-md">
                      Tham gia
                    </button>
                  )}
                  {status === 'pending' && <span className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg"><Clock size={16}/> Chờ duyệt</span>}
                  {status === 'active' && <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg"><CheckCircle size={16}/> Đang học</span>}
                  {status === 'completed' && <span className="text-sm font-bold text-blue-600">Đã HT</span>}
                  {status === 'dropped' && <span className="text-sm font-bold text-red-600">Đã hủy</span>}
                </div>
              </div>
            );
          })}

          {activeTab === 'my' && myEnrollments.map(enroll => (
            <div key={enroll.id} className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-6">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{enroll.Course?.name}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">Đăng ký ngày: {new Date(enroll.createdAt).toLocaleDateString('vi-VN')}</p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                {enroll.status === 'pending' && <span className="w-full text-center py-2 text-sm font-bold text-yellow-600 bg-yellow-50 rounded-xl">Đang chờ Gia sư duyệt</span>}
                {enroll.status === 'active' && <span className="w-full text-center py-2 text-sm font-bold text-green-600 bg-green-50 rounded-xl">Đang trong quá trình học</span>}
                {enroll.status === 'completed' && <span className="w-full text-center py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl">Đã hoàn thành khóa học</span>}
                {enroll.status === 'dropped' && <span className="w-full text-center py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl">Đã ngừng học</span>}
              </div>
            </div>
          ))}
        </div>

        {((activeTab === 'all' && courses.length === 0) || (activeTab === 'my' && myEnrollments.length === 0)) && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 mt-8 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={48} className="text-slate-300" />
            </div>
            <p className="text-xl font-semibold text-slate-700">Chưa có dữ liệu nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
