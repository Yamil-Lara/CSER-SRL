import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Tu backend Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para inyectar el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  // Buscamos el token usando 'token' (como lo tenías originalmente) o 'auth_token'
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;