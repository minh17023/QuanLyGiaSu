import api from './api';

export const getStudentFinances = async (month, year) => {
  const params = {};
  if (month && year) {
    params.month = month;
    params.year = year;
  }
  const response = await api.get('/dashboard/finances', { params });
  return response.data;
};

export const addPayment = async (student_id, amount, note = '') => {
  const response = await api.post('/dashboard/payments', { student_id, amount, note });
  return response.data;
};
