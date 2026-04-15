import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaGithub, FaGlobe, FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import axios from '../api/axios';

// Workaround para TypeScript
const LinkedinIcon = FaLinkedin as React.ElementType;
const GithubIcon = FaGithub as React.ElementType;
const GlobeIcon = FaGlobe as React.ElementType;
const FacebookIcon = FaFacebook as React.ElementType;
const InstagramIcon = FaInstagram as React.ElementType;
const TwitterIcon = FaXTwitter as React.ElementType;

const LinksPage = () => {
  const [formData, setFormData] = useState({
    linkedin: '',
    github: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Obtenemos los datos actuales
        const response = await axios.get('/user/profile');
        const data = response.data.data;
        setFormData({
          linkedin: data.linkedin || '',
          github: data.github || '',
          website: data.website || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
        });
      } catch (error) {
        console.error('Error al cargar perfil', error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // LLAMAMOS AL NUEVO ENDPOINT DE ENLACES
      await axios.put('/user/links', formData);
      setMessage({ type: 'success', text: 'Redes sociales guardadas correctamente.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al guardar los enlaces.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-center py-10 text-gray-500">Cargando enlaces...</p>;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Redes Sociales</h2>
        <p className="text-gray-500">Administra tus enlaces profesionales y sociales de manera independiente.</p>
      </div>

      {message && <Alert type={message.type} message={message.text} className="mb-6" />}

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <LinkedinIcon className="w-5 h-5 text-blue-600" /> LinkedIn
            </label>
            <Input type="url" name="linkedin" placeholder="https://linkedin.com/in/tu-perfil" value={formData.linkedin} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <GithubIcon className="w-5 h-5 text-gray-800" /> GitHub
            </label>
            <Input type="url" name="github" placeholder="https://github.com/tu-usuario" value={formData.github} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <FacebookIcon className="w-5 h-5 text-blue-500" /> Facebook
            </label>
            <Input type="url" name="facebook" placeholder="https://facebook.com/tu-usuario" value={formData.facebook} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <InstagramIcon className="w-5 h-5 text-pink-600" /> Instagram
            </label>
            <Input type="url" name="instagram" placeholder="https://instagram.com/tu-usuario" value={formData.instagram} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <TwitterIcon className="w-5 h-5 text-black" /> X (ex Twitter)
            </label>
            <Input type="url" name="twitter" placeholder="https://x.com/tu-usuario" value={formData.twitter} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
              <GlobeIcon className="w-5 h-5 text-green-600" /> Sitio Web Personal
            </label>
            <Input type="url" name="website" placeholder="https://tu-sitio.com" value={formData.website} onChange={handleChange} />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Redes Sociales'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinksPage;