import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Có thể đặt vào file .env sau
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token vào Header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
