import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminClasses from './pages/admin/AdminClasses';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAttendances from './pages/admin/AdminAttendances';
import UserLogin from './pages/user/Login';
import UserRegister from './pages/user/Register';
import UserDashboard from './pages/user/UserDashboard';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '16px',
          background: '#fff',
          color: '#18181b', // zinc-900
          fontWeight: '600',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
      }} />
      <Routes>
        <Route path="/" element={<Navigate to="/user/login" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Nested Layout Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="attendances" element={<AdminAttendances />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>
        
        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        
        <Route path="*" element={<Navigate to="/user/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
