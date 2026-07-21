import api from './api';

export const exportDatabase = async () => {
  const response = await api.get('/backup/export');
  return response.data;
};

export const importDatabase = async (data) => {
  const response = await api.post('/backup/import', data);
  return response.data;
};
