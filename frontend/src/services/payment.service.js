import api from './api';

export const getPaymentsByStudent = async (studentId) => {
  const response = await api.get(`/payments/student/${studentId}`);
  return response.data;
};

export const createPayment = async (data) => {
  const response = await api.post('/payments', data);
  return response.data;
};

export const updatePayment = async (id, data) => {
  const response = await api.put(`/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};
