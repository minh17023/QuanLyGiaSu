import api from './api';

export const enrollCourse = async (course_id) => {
  const response = await api.post('/enrollments', { course_id });
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get('/enrollments/me');
  return response.data;
};

export const getAllEnrollments = async () => {
  const response = await api.get('/enrollments/all');
  return response.data;
};

export const updateEnrollmentStatus = async (id, status) => {
  const response = await api.put(`/enrollments/${id}/status`, { status });
  return response.data;
};

export const adminEnrollCourse = async (student_id, class_id) => {
  const response = await api.post('/enrollments/admin', { student_id, class_id });
  return response.data;
};

export const deleteEnrollment = async (id) => {
  const response = await api.delete(`/enrollments/${id}`);
  return response.data;
};
