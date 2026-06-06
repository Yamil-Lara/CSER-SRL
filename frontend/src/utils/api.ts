import axios from 'axios';

// ✅ CORRECCIÓN: Leer variable de entorno (funciona en laptop y celular)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Accept': 'application/json'
  }
});

// Función centralizada para construir URLs de imágenes dinámicamente
export const buildUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;

  // ✅ CORRECCIÓN: Usar la misma variable de entorno
  const domain = API_URL;

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  if (cleanPath.startsWith('storage/')) {
    return `${domain}/${cleanPath}`;
  }
  return `${domain}/storage/${cleanPath}`;
};

// Interceptor de Peticiones: Inyecta el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // IMPORTANTE: Si estamos enviando FormData, NO establecer Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Respuestas: Maneja la expiración de sesión (401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      
      if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/explore')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;