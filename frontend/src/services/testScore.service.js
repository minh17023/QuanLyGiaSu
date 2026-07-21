import api from './api';

export const getTestScoresByStudent = async (studentId) => {
  const response = await api.get(`/test-scores/student/${studentId}`);
  return response.data;
};

export const createTestScore = async (data) => {
  const response = await api.post('/test-scores', data);
  return response.data;
};

export const deleteTestScore = async (id) => {
  const response = await api.delete(`/test-scores/${id}`);
  return response.data;
};
