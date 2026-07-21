import api from './api';

export const getStudentFinances = async () => {
  const response = await api.get('/dashboard/finances');
  return response.data;
};

export const addPayment = async (student_id, amount, note = '') => {
  const response = await api.post('/dashboard/payments', { student_id, amount, note });
  return response.data;
};
