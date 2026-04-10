import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProfileData } from '../types';

// 1. Obtenemos la URL del backend y evitamos el error de TypeScript con (import.meta as any)
const API_URL = 'http://127.0.0.1:8000/api';
const STORAGE_URL = 'http://127.0.0.1:8000/storage';

const defaultProfile: ProfileData = {
  nombre: '',
  username: '',
  email: '',
  profesion: '',
  especialidad: '',
  biografia: '',
  ubicacion: '',
  telefono: '',
  universidad: '',
  carrera: '',
  linkedin: '',
  github_perfil: '',
  sitio_web: '',
  password: '',
  image_url: null,
};

const isValidUrl = (value: string): boolean => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const iconSet = {
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 7L3.5 12L8.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 7L20.5 12L15.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  resume: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  skills: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 7.5L12 12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 7.5L12 12" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  experience: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 7V4H16V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="4" y="7" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  links: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14L7 17C5.34315 18.6569 3.5 18.3284 3.5 16.5C3.5 14.6716 5.34315 14.3431 7 16L8.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 10L17 7C18.6569 5.34315 20.5 5.67157 20.5 7.5C20.5 9.32843 18.6569 9.65685 17 8L15.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8.5 15.5L15.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  education: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L4 7L12 11L20 7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 7V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H18C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 11V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  visibility: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  sun: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 21V23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M21 12H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  moon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79C20.24 12.93 19.45 13 18.65 13C13.37 13 9 8.63 9 3.35C9 2.55 9.07 1.76 9.21 1C4.79 1.92 1.5 6.03 1.5 11.5C1.5 17.3 6.7 22 12.5 22C17.97 22 22.08 18.71 23 14.29C22.24 14.13 21.47 13.99 20.69 13.89C20.47 13.86 20.24 13.85 20 13.85C19.08 13.85 18.21 13.74 17.4 13.55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 10.5C15.5 13.5376 13.0376 16 10 16C8.97056 16 7.99309 15.7646 7.1366 15.356" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  collapse: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 5H5C4.44772 5 4 5.44772 4 6V18C4 18.5523 4.44772 19 5 19H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  hamburger: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  save: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V7.5C21 7.5 21 7.5 20.5 7L17 3.5C16.5 3 16 3 16 3H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 3V8H17V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  eye: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  eyeOff: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.584 10.587C10.2087 11.0227 10 11.5797 10 12.1662C10 13.5054 11.0294 14.5662 12.3437 14.5662C12.9282 14.5662 13.4862 14.358 13.9218 13.9826" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.513 5.73467C10.591 5.26005 11.7897 5 12.9995 5C19.9374 5 23.3657 10.7039 23.4358 10.8216C23.4779 10.8897 23.5 10.9915 23.5 11.1c0 0.1085-.0221.2103-.0642.2784 C23.1244 11.8952 22.0868 13.8848 20.5619 15.4095" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.61 6.61C5.29337 7.92661 4.19733 9.77974 3.5642 11.0784C3.0221 12.0895 2.75 12.5952 2.75 13C2.75 13.4048 3.0221 13.9105 3.5642 14.9216C5.3945 18.4671 8.95233 22 12 22C13.5181 22 15.017 21.5973 16.39 20.8368" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  graduation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 6V11.5C2 17.2 12 22 12 22S22 17.2 22 11.5V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  link: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13C10.4295 13.5741 11.0787 14.0605 11.8738 14.3993C12.6689 14.7381 13.5878 14.9077 14.5 14.9C15.4122 14.8923 16.3274 14.7071 17.1179 14.357C17.9084 14.0068 18.5501 13.5075 18.99 12.9M14 7C13.5705 6.42588 12.9213 5.93952 12.1262 5.60068C11.3311 5.26184 10.4122 5.09227 9.5 5.1C8.58784 5.10773 7.67257 5.29288 6.88214 5.64298C6.09171 5.99308 5.44992 6.49249 5.01 7.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 4.5H21.5V7.5M6.5 16.5H3.5V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.5 4.5L15 11M9 17L3.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const sidebarItems = [
  { id: 'resumen', label: 'Mi Resumen', icon: iconSet.resume },
  { id: 'perfil', label: 'Editar Perfil', icon: iconSet.profile },
  { id: 'proyectos', label: 'Mis Proyectos', icon: iconSet.projects },
  { id: 'habilidades', label: 'Mis Habilidades', icon: iconSet.skills },
  { id: 'experiencia', label: 'Experiencia', icon: iconSet.experience },
  { id: 'enlaces', label: 'Enlaces', icon: iconSet.links },
  { id: 'visibilidad', label: 'Visibilidad', icon: iconSet.visibility },
];

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 991;
  });
  const [activeItem, setActiveItem] = useState('perfil');

  // Función auxiliar robusta para construir la URL de la imagen de perfil
  const buildUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage')) {
      return `http://127.0.0.1:8000${path}`;
    }
    if (path.startsWith('storage')) {
      return `http://127.0.0.1:8000/${path}`;
    }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${STORAGE_URL}/${cleanPath}`;
  };

  const normalizeUserData = (payload: any) => {
    if (!payload) return null;
    if (payload.user) return payload.user;
    if (payload.data) return payload.data;
    return payload;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = normalizeUserData(response.data);
        if (!userData) return;

        setProfile({
          nombre: userData.nombre || '',
          email: userData.email || '',
          username: userData.username || '',
          profesion: userData.profesion || '',
          especialidad: userData.especialidad || '',
          biografia: userData.biografia || '',
          ubicacion: userData.ubicacion || '',
          telefono: userData.telefono || '',
          universidad: userData.universidad || '',
          carrera: userData.carrera || '',
          linkedin: userData.linkedin || '',
          github_perfil: userData.github_perfil || '',
          sitio_web: userData.sitio_web || '',
          password: '',
          image_url: userData.foto || userData.image_url || null,
        });

        const imagePath = userData.foto || userData.image_url;
        if (imagePath) {
          setPreviewUrl(buildUrl(imagePath));
        }
      })
      .catch((error) => {
        console.error('Error cargando perfil:', error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 991) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!profile.nombre.trim()) nextErrors.nombre = 'El nombre es requerido.';
    if (!profile.email.trim()) nextErrors.email = 'El correo es requerido.';
    if (!profile.profesion.trim()) nextErrors.profesion = 'La profesión es requerida.';
    if (!profile.especialidad.trim()) nextErrors.especialidad = 'La especialidad es requerida.';
    if (profile.linkedin && !isValidUrl(profile.linkedin)) nextErrors.linkedin = 'LinkedIn no es una URL válida.';
    if (profile.github_perfil && !isValidUrl(profile.github_perfil)) nextErrors.github_perfil = 'GitHub no es una URL válida.';
    if (profile.sitio_web && !isValidUrl(profile.sitio_web)) nextErrors.sitio_web = 'El sitio web no es una URL válida.';

    if (fotoFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(fotoFile.type)) {
        nextErrors.foto = 'Solo se permiten JPG, PNG o WEBP.';
      }
      if (fotoFile.size > 2 * 1024 * 1024) {
        nextErrors.foto = 'El archivo no puede superar los 2MB.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setFotoFile(null);
      setPreviewUrl(buildUrl(profile.image_url));
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors({ ...errors, foto: 'Solo se permiten JPG, PNG o WEBP.' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, foto: 'El archivo no puede superar los 2MB.' });
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.foto;
      return next;
    });

    setFotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    // Identidad del usuario
    formData.append('nombre', profile.nombre);
    formData.append('username', profile.username);
    formData.append('email', profile.email);
    // Información profesional
    formData.append('profesion', profile.profesion);
    formData.append('especialidad', profile.especialidad); // Exacto: 'especialidad'
    formData.append('biografia', profile.biografia || '');
    formData.append('ubicacion', profile.ubicacion || '');
    formData.append('telefono', profile.telefono || '');
    // Formación académica
    formData.append('universidad', profile.universidad || '');
    formData.append('carrera', profile.carrera || '');
    // Redes sociales - Nombres exactos de columnas en BD
    formData.append('linkedin', profile.linkedin || '');
    formData.append('github_perfil', profile.github_perfil || ''); // Exacto: 'github_perfil'
    formData.append('sitio_web', profile.sitio_web || '');
    
    // Solo envía contraseña si no está vacía (política de seguridad)
    if (profile.password && profile.password.trim()) {
      formData.append('password', profile.password);
    }

    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_URL}/user/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfile = normalizeUserData(response.data);
      setProfile((current) => ({
        ...current,
        password: '', // Limpiar contraseña tras guardado exitoso
        image_url: updatedProfile?.foto ?? updatedProfile?.image_url ?? current.image_url,
      }));

      const imagePath = updatedProfile?.foto ?? updatedProfile?.image_url;
      if (imagePath) {
        setPreviewUrl(buildUrl(imagePath));
      }
      setSuccessMessage('¡Datos guardados correctamente!');
      setShowSuccessMessage(true);
      setFotoFile(null);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const errorMessages: Record<string, string> = {};
          Object.keys(validationErrors).forEach((key) => {
            errorMessages[key] = validationErrors[key][0];
          });
          setErrors(errorMessages);
        } else {
          setErrors({ submit: 'Errores de validación en el servidor.' });
        }
      } else {
        const message = axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Error al guardar el perfil.';
        setErrors({ submit: message });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
  };

  const handleLogout = () => {
    setSuccessMessage('Sesión cerrada.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className={`app-shell theme-${theme} ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-icon">{iconSet.code}</span>
            <span className="brand-text">DevFolio</span>
          </div>
          <nav>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="separator" />

        <div className="bottom">
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            <span className="icon">{theme === 'light' ? iconSet.moon : iconSet.sun}</span>
          </button>
          <button type="button" className="nav-action" onClick={() => window.open(window.location.href, '_blank')}>
            <span className="icon">{iconSet.visibility}</span>
            <span className="label">Ver Portafolio</span>
          </button>
          <button type="button" className="nav-action" onClick={toggleSidebar}>
            <span className="icon">{iconSet.collapse}</span>
            <span className="label">Colapsar</span>
          </button>
          <button type="button" className="nav-action logout" onClick={handleLogout}>
            <span className="icon">{iconSet.logout}</span>
            <span className="label">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-heading">
          <div>
            <h1>Editar Perfil</h1>
            <p className="page-subtitle">Actualiza tu información profesional y mantén tu portafolio al día.</p>
          </div>
          <button type="button" className="hamburger-menu" onClick={toggleSidebar} aria-label="Menú">
            {iconSet.hamburger}
          </button>
        </div>

        {sidebarCollapsed && <div className="sidebar-overlay" onClick={toggleSidebar} />}

        <div className="page-body">
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <section className="card-section profile-card mb-4">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.profile}</span>
                  <h2>Foto de Perfil</h2>
                </div>
              </div>
              <div className="card-section-body row align-items-center">
                <div className="col-md-3 text-center">
                  <div className="avatar-preview">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Perfil" />
                    ) : (
                      <div className="avatar-placeholder">{iconSet.profile}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-9">
                  <label className="upload-button">
                    Subir foto
                    <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleFileChange} />
                  </label>
                  <p className="helper-text">JPG, PNG o WEBP. Máximo 2 MB.</p>
                  {errors.foto && <div className="text-danger">{errors.foto}</div>}
                </div>
              </div>
            </section>

            <section className="card-section profile-card mb-4">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.resume}</span>
                  <h2>Información básica</h2>
                </div>
              </div>
              <div className="card-section-body">
                {/* Fila 1: Nombre Completo | Correo Electrónico */}
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ej. Elena Montes de Oca"
                      value={profile.nombre}
                      onChange={handleChange}
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.nombre}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Ej. elena@example.com"
                      value={profile.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>
                </div>

                {/* Fila 2: Usuario | Nueva Contraseña */}
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre de usuario</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Ej. elena.montes"
                      value={profile.username}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nueva contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mínimo 8 caracteres"
                        value={profile.password || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                        }}
                        aria-label="Alternar visibilidad de contraseña"
                      >
                        {showPassword ? iconSet.eyeOff : iconSet.eye}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fila 3: Especialidad | Profesión */}
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Especialidad</label>
                    <input
                      type="text"
                      name="especialidad"
                      placeholder="Ej. React & Node.js"
                      value={profile.especialidad}
                      onChange={handleChange}
                      className={`form-control ${errors.especialidad ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.especialidad}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Profesión</label>
                    <input
                      type="text"
                      name="profesion"
                      placeholder="Ej. Ingeniera de Sistemas"
                      value={profile.profesion}
                      onChange={handleChange}
                      className={`form-control ${errors.profesion ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.profesion}</div>
                  </div>
                </div>

                {/* Fila 4: Biografía (Ancho completo) */}
                <div className="mb-3">
                  <label className="form-label">Biografía</label>
                  <textarea
                    name="biografia"
                    placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses..."
                    value={profile.biografia || ''}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>

                {/* Fila 5: Ubicación | Teléfono */}
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Ubicación</label>
                    <input
                      type="text"
                      name="ubicacion"
                      placeholder="Ej. La Paz, Bolivia"
                      value={profile.ubicacion || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="Ej. +591 12345678"
                      value={profile.telefono || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="card-section profile-card mb-4">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.graduation}</span>
                  <h2>Formación Académica</h2>
                </div>
              </div>
              <div className="card-section-body row gx-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Universidad</label>
                  <input
                    type="text"
                    name="universidad"
                    placeholder="Ej. Universidad Mayor de San Simón"
                    value={profile.universidad || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Carrera</label>
                  <input
                    type="text"
                    name="carrera"
                    placeholder="Ej. Ingeniería de Sistemas"
                    value={profile.carrera || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </section>

            <section className="card-section profile-card mb-4">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.link}</span>
                  <h2>Redes Sociales</h2>
                </div>
              </div>
              <div className="card-section-body">
                <div className="mb-3">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/tu-perfil"
                    value={profile.linkedin || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.linkedin ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.linkedin}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">GitHub</label>
                  <input
                    type="url"
                    name="github_perfil"
                    placeholder="https://github.com/tu-usuario"
                    value={profile.github_perfil || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.github_perfil ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.github_perfil}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Sitio web personal</label>
                  <input
                    type="url"
                    name="sitio_web"
                    placeholder="https://tu-sitio.com"
                    value={profile.sitio_web || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.sitio_web ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.sitio_web}</div>
                </div>
              </div>
            </section>

            <div className="page-actions d-flex justify-content-end gap-3 mt-4 align-items-center">
              {showSuccessMessage && (
                <div style={{ color: '#28a745', fontWeight: 500, fontSize: '0.95rem', animation: 'fadeIn 0.3s ease-in' }}>
                  ✓ {successMessage}
                </div>
              )}
              <button type="button" className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} title="Guarda los cambios realizados">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                  {iconSet.save}
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
