import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`,
  headers: {
    'Accept': 'application/json'
  }
});

// Función centralizada para construir URLs de imágenes dinámicamente
export const buildUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;

  // Extraemos la base (ej: http://localhost:8000 o http://cser.tis.cs.umss.edu.bo)
  const baseApiUrl = api.defaults.baseURL || 'http://localhost:8000/api';
  const domain = baseApiUrl.replace(/\/api$/, '');

  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  if (cleanPath.startsWith('storage/')) {
    return `${domain}/${cleanPath}`;
  }
  return `${domain}/storage/${cleanPath}`;
};

// Interceptor de Peticiones: Inyecta el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  // Buscamos el token usando 'token' o 'auth_token'
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// NUEVO: Interceptor de Respuestas: Maneja la expiración de sesión (401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la dejamos pasar tal cual
    return response;
  },
  (error) => {
    // Si el backend responde con un error 401 (No Autorizado)
    if (error.response && error.response.status === 401) {

      // 1. Destruimos completamente los datos de sesión locales
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Limpiamos el header de autorización por defecto
      delete api.defaults.headers.common['Authorization'];

      // 2. Redirigimos forzosamente al login
      // Usamos window.location.replace para no dejar la página protegida en el historial
      if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/explore')) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;