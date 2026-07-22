import api from './api';

export const getSchedulesByDate = async (date) => {
  const response = await api.get(`/attendances/schedules?date=${date}`);
  return response.data;
};

export const getAttendanceForSchedule = async (scheduleId) => {
  const response = await api.get(`/attendances/${scheduleId}`);
  return response.data;
};

export const markAttendance = async (schedule_id, student_id, status, lesson_content, comments) => {
  const response = await api.post('/attendances/mark', { schedule_id, student_id, status, lesson_content, comments });
  return response.data;
};
