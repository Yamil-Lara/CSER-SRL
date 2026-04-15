import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProfileData } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { User, FileText, GraduationCap, Eye, EyeOff, Save } from 'lucide-react'; // Quitamos LinkIcon

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
  password: '',
  image_url: null,
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      .get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
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
          password: '',
          image_url: userData.foto || userData.image_url || null,
        });

        const imagePath = userData.foto || userData.image_url;
        if (imagePath) {
          setPreviewUrl(buildUrl(imagePath));
        }
      })
      .catch((error) => console.error('Error cargando perfil:', error));
  }, []);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!profile.nombre.trim()) nextErrors.nombre = 'El nombre es requerido.';
    if (!profile.email.trim()) nextErrors.email = 'El correo es requerido.';
    if (!profile.profesion.trim()) nextErrors.profesion = 'La profesión es requerida.';
    if (!profile.especialidad.trim()) nextErrors.especialidad = 'La especialidad es requerida.';

    if (fotoFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(fotoFile.type)) {
        nextErrors.foto = 'Solo se permiten JPG, PNG o WEBP.';
      }
      if (fotoFile.size > 10 * 1024 * 1024) {
        nextErrors.foto = 'El archivo no puede superar los 10MB.';
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

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, foto: 'El archivo no puede superar los 10MB.' });
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    const formData = new FormData();
    formData.append('nombre', profile.nombre);
    formData.append('username', profile.username);
    formData.append('email', profile.email);
    formData.append('profesion', profile.profesion);
    formData.append('especialidad', profile.especialidad);
    formData.append('biografia', profile.biografia || '');
    formData.append('ubicacion', profile.ubicacion || '');
    formData.append('telefono', profile.telefono || '');
    formData.append('universidad', profile.universidad || '');
    formData.append('carrera', profile.carrera || '');
    
    if (profile.password && profile.password.trim()) {
      formData.append('password', profile.password);
    }

    if (fotoFile) {
      formData.append('foto', fotoFile);
    }
    formData.append('_method', 'PUT');

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedProfile = normalizeUserData(response.data);
      setProfile((current) => ({
        ...current,
        password: '',
        image_url: updatedProfile?.foto ?? updatedProfile?.image_url ?? current.image_url,
      }));

      const imagePath = updatedProfile?.foto ?? updatedProfile?.image_url;
      if (imagePath) {
        setPreviewUrl(buildUrl(imagePath));
      }
      setSuccessMessage('¡Datos guardados correctamente!');
      setShowSuccessMessage(true);
      setFotoFile(null);
      
      setTimeout(() => setShowSuccessMessage(false), 3500);
    } catch (error: any) {
      if (error.response?.status === 422) {
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
        setErrors({ submit: error.response?.data?.message || 'Error al guardar el perfil.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-sidebar mb-2">Editar Perfil</h1>
          <p className="text-sidebar/60">Actualiza tu información profesional y mantén tu portafolio al día</p>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 font-medium">
          ✓ {successMessage}
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* === SECCIÓN FOTO DE PERFIL === */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-sidebar m-0">Foto de Perfil</h2>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
              {previewUrl ? (
                <img src={previewUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-sidebar/30" />
              )}
            </div>
            <div>
              <label className="inline-block cursor-pointer px-4 py-2 border border-blue-200 text-primary bg-white hover:bg-blue-50 rounded-md font-medium text-sm transition-colors shadow-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Subir Foto
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleFileChange} />
              </label>
              <p className="text-xs text-sidebar/60 mt-2">JPG, PNG o WEBP. Máximo 10 MB.</p>
              {errors.foto && <p className="text-xs text-destructive mt-1">{errors.foto}</p>}
            </div>
          </div>
        </Card>

        {/* === SECCIÓN INFORMACIÓN BÁSICA === */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-sidebar m-0">Información Básica</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input 
              label="Nombre Completo *" 
              name="nombre" 
              placeholder="Ej. Ana García" 
              value={profile.nombre} 
              onChange={handleChange} 
              error={errors.nombre}
            />
            <Input 
              label="Correo Electrónico *" 
              name="email" 
              type="email"
              placeholder="ana@example.com" 
              value={profile.email} 
              onChange={handleChange} 
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input 
              label="Nombre de usuario" 
              name="username" 
              placeholder="Ej. ana.garcia" 
              value={profile.username} 
              onChange={handleChange} 
            />
            <div className="relative">
              <Input 
                label="Nueva contraseña" 
                name="password" 
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres" 
                value={profile.password || ''} 
                onChange={handleChange} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-[34px] text-sidebar/40 hover:text-sidebar/70"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input 
              label="Profesión" 
              name="profesion" 
              placeholder="Ej. Desarrolladora Full Stack" 
              value={profile.profesion} 
              onChange={handleChange} 
              error={errors.profesion}
            />
            <Input 
              label="Especialidad" 
              name="especialidad" 
              placeholder="Ej. React & Node.js" 
              value={profile.especialidad} 
              onChange={handleChange} 
              error={errors.especialidad}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input 
              label="Ubicación" 
              name="ubicacion" 
              placeholder="Ej. La Paz, Bolivia" 
              value={profile.ubicacion || ''} 
              onChange={handleChange} 
            />
            <Input 
              label="Teléfono" 
              name="telefono" 
              placeholder="Ej: +591 12345678" 
              value={profile.telefono || ''} 
              onChange={handleChange} 
            />
          </div>

          <div className="mt-2">
            <Textarea 
              label="Biografía" 
              name="biografia" 
              placeholder="Apasionada por crear experiencias web increíbles..." 
              value={profile.biografia || ''} 
              onChange={handleChange} 
              rows={4}
            />
          </div>
        </Card>

        {/* === SECCIÓN FORMACIÓN ACADÉMICA === */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <GraduationCap className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-sidebar m-0">Formación Académica</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Universidad" 
              name="universidad" 
              placeholder="Ej. Universidad Mayor de San Simón" 
              value={profile.universidad || ''} 
              onChange={handleChange} 
            />
            <Input 
              label="Carrera" 
              name="carrera" 
              placeholder="Ej. Ingeniería de Sistemas" 
              value={profile.carrera || ''} 
              onChange={handleChange} 
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="ghost" type="button" onClick={() => window.location.reload()}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;