import api from './api';

export const getStudentFinances = async (startDateStr, endDateStr) => {
  const params = {};
  if (startDateStr && endDateStr) {
    params.startDateStr = startDateStr;
    params.endDateStr = endDateStr;
  }
  const response = await api.get('/dashboard/finances', { params });
  return response.data;
};

export const addPayment = async (student_id, amount, note = '') => {
  const response = await api.post('/dashboard/payments', { student_id, amount, note });
  return response.data;
};
