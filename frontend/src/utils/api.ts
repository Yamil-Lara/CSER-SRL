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
  // Asumiendo que guardaste el token como 'auth_token' al hacer login
  const token = localStorage.getItem('auth_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;