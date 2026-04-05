import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProfileData } from '../types';

// 1. Obtenemos la URL del backend y evitamos el error de TypeScript con (import.meta as any)
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://127.0.0.1:8000';

const defaultProfile: ProfileData = {
  name: '',
  email: '',
  profession: '',
  specialty: '',
  biography: '',
  skills: '',
  experience: '',
  location: '',
  phone: '',
  linkedin: '',
  github: '',
  website: '',
  university: '',
  career: '',
  education: '',
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
      <path d="M8.5 7L3.5 12L8.5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 7L20.5 12L15.5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  resume: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  skills: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 3V21" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 7.5L12 12" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 7.5L12 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  experience: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 7V4H16V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="4" y="7" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  links: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14L7 17C5.34315 18.6569 3.5 18.3284 3.5 16.5C3.5 14.6716 5.34315 14.3431 7 16L8.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 10L17 7C18.6569 5.34315 20.5 5.67157 20.5 7.5C20.5 9.32843 18.6569 9.65685 17 8L15.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8.5 15.5L15.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  education: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L4 7L12 11L20 7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4 7V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H18C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17V7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 11V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  visibility: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  sun: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  moon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79C20.24 12.93 19.45 13 18.65 13C13.37 13 9 8.63 9 3.35C9 2.55 9.07 1.76 9.21 1C4.79 1.92 1.5 6.03 1.5 11.5C1.5 17.3 6.7 22 12.5 22C17.97 22 22.08 18.71 23 14.29C22.24 14.13 21.47 13.99 20.69 13.89C20.47 13.86 20.24 13.85 20 13.85C19.08 13.85 18.21 13.74 17.4 13.55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 10.5C15.5 13.5376 13.0376 16 10 16C8.97056 16 7.99309 15.7646 7.1366 15.356" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  collapse: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 5H5C4.44772 5 4 5.44772 4 6V18C4 18.5523 4.44772 19 5 19H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  hamburger: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 991;
  });
  const [activeItem, setActiveItem] = useState('perfil');

  // Función auxiliar robusta para construir la URL
  const buildUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const cleanBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${cleanBase}/${cleanPath}`;
  };

  useEffect(() => {
    axios
      .get<ProfileData>(`${API_URL}/api/profile`)
      .then((response) => {
        setProfile(response.data);
        if (response.data.image_url) {
            setPreviewUrl(buildUrl(response.data.image_url));
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

    if (!profile.name.trim()) nextErrors.name = 'El nombre es requerido.';
    if (!profile.email.trim()) nextErrors.email = 'El correo es requerido.';
    if (!profile.profession.trim()) nextErrors.profession = 'La profesión es requerida.';
    if (!profile.specialty.trim()) nextErrors.specialty = 'La especialidad es requerida.';
    if (profile.linkedin && !isValidUrl(profile.linkedin)) nextErrors.linkedin = 'LinkedIn no es una URL válida.';
    if (profile.github && !isValidUrl(profile.github)) nextErrors.github = 'GitHub no es una URL válida.';
    if (profile.website && !isValidUrl(profile.website)) nextErrors.website = 'El sitio web no es una URL válida.';

    if (imageFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        nextErrors.image = 'Solo se permiten JPG, PNG o WEBP.';
      }
      if (imageFile.size > 10 * 1024 * 1024) {
        nextErrors.image = 'El archivo no puede superar los 10MB.';
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
      setImageFile(null);
      setPreviewUrl(buildUrl(profile.image_url));
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors({ ...errors, image: 'Solo se permiten JPG, PNG o WEBP.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: 'El archivo no puede superar los 10MB.' });
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('profession', profile.profession);
    formData.append('specialty', profile.specialty);
    formData.append('biography', profile.biography || '');
    formData.append('skills', profile.skills || '');
    formData.append('experience', profile.experience || '');
    formData.append('location', profile.location || '');
    formData.append('phone', profile.phone || '');
    formData.append('linkedin', profile.linkedin || '');
    formData.append('github', profile.github || '');
    formData.append('website', profile.website || '');
    formData.append('university', profile.university || '');
    formData.append('career', profile.career || '');
    formData.append('education', profile.education || '');

    if (imageFile) {
      formData.append('image', imageFile);
    }

    setLoading(true);

    try {
      const response = await axios.post<ProfileData>(`${API_URL}/api/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile(response.data);
      if (response.data.image_url) {
          setPreviewUrl(buildUrl(response.data.image_url));
      }
      setSuccessMessage('Perfil actualizado con éxito.');
      setImageFile(null);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) && error.response?.data?.message
        ? String(error.response.data.message)
        : 'Error al guardar el perfil.';
      setErrors({ submit: message });
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
          <button type="button" className="nav-action" onClick={() => window.open(window.location.href, '_blank')}>
            <span className="icon">{iconSet.visibility}</span>
            <span className="label">Ver Portafolio</span>
          </button>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            <span className="icon">{theme === 'light' ? iconSet.moon : iconSet.sun}</span>
            <span className="label">{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
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
            <p className="page-subtitle">Actualiza tu información profesional y optimiza tu portafolio.</p>
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
            <section className="card-section profile-card">
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
                  <label className="btn btn-outline-primary upload-button">
                    Subir foto
                    <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleFileChange} />
                  </label>
                  <p className="helper-text">JPG, PNG o WEBP. Máximo 10 MB.</p>
                  {errors.image && <div className="text-danger">{errors.image}</div>}
                </div>
              </div>
            </section>

            <section className="card-section profile-card">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.resume}</span>
                  <h2>Información básica</h2>
                </div>
              </div>
              <div className="card-section-body row gx-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Profesión</label>
                  <input
                    type="text"
                    name="profession"
                    value={profile.profession}
                    onChange={handleChange}
                    className={`form-control ${errors.profession ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.profession}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Especialidad</label>
                  <input
                    type="text"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleChange}
                    className={`form-control ${errors.specialty ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.specialty}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ubicación</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </section>

            <section className="card-section profile-card">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.skills}</span>
                  <h2>Perfil profesional</h2>
                </div>
              </div>
              <div className="card-section-body row gx-3">
                <div className="col-12 mb-3">
                  <label className="form-label">Biografía</label>
                  <textarea
                    name="biography"
                    value={profile.biography || ''}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Habilidades</label>
                  <input
                    type="text"
                    name="skills"
                    value={profile.skills || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej. React, Node.js, UI/UX"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Experiencia</label>
                  <textarea
                    name="experience"
                    value={profile.experience || ''}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>
              </div>
            </section>

            <section className="card-section profile-card">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.education}</span>
                  <h2>Formación académica</h2>
                </div>
              </div>
              <div className="card-section-body row gx-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Universidad</label>
                  <input
                    type="text"
                    name="university"
                    value={profile.university || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Carrera</label>
                  <input
                    type="text"
                    name="career"
                    value={profile.career || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Datos académicos</label>
                  <textarea
                    name="education"
                    value={profile.education || ''}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                  />
                </div>
              </div>
            </section>

            <section className="card-section profile-card">
              <div className="card-section-header">
                <div>
                  <span className="section-icon">{iconSet.links}</span>
                  <h2>Enlaces</h2>
                </div>
              </div>
              <div className="card-section-body row gx-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.linkedin ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.linkedin}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.github ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.github}</div>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Sitio web personal</label>
                  <input
                    type="url"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleChange}
                    className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.website}</div>
                </div>
              </div>
            </section>

            <div className="page-actions d-flex justify-content-end gap-3 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;