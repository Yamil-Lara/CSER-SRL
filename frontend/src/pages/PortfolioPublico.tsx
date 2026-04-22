import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PublicPortfolio, { PortfolioData } from '../components/PublicPortfolio';

export default function PortfolioPublico() {
  const { username } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LLamar a las múltiples rutas que el nuevo backend definió
    const fetchData = async () => {
      try {
        const [userRes, projectsRes, experienceRes, skillsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/portafolio/${username}`),
          axios.get(`http://localhost:8000/api/portafolio/${username}/proyectos`),
          axios.get(`http://localhost:8000/api/portafolio/${username}/experiencias`),
          axios.get(`http://localhost:8000/api/portafolio/${username}/habilidades`)
        ]);

        // Adaptado al ApiResponseTrait (res.data.data)
        const user = userRes.data.data.usuario;
        const redes = userRes.data.data.redes_sociales || {};
        const proyectos = projectsRes.data.data || [];
        const experiencias = experienceRes.data.data || [];
        const habilidades = skillsRes.data.data || [];
        
        const mappedData: PortfolioData = {
          name: user.nombre,
          profession: user.profesion || 'Desarrollador Full Stack',
          technologies: user.especialidad || 'React & Node.js',
          bio: user.biografia || 'Apasionada por crear experiencias web increíbles',
          location: user.ubicacion || 'La Paz, Bolivia',
          email: user.email,
          socials: {
            linkedin: redes.linkedin,
            github: redes.github,
            sitio_web: redes.sitio_web,
            facebook: redes.facebook,
            instagram: redes.instagram,
            twitter: redes.twitter,
            tiktok: redes.tiktok,
            threads: redes.threads,
          },
          skills: {
            technical: habilidades.filter((s:any) => s.type === 'tecnica').map((s: any) => ({ name: s.name, percentage: s.level })),
            soft: habilidades.filter((s:any) => s.type === 'blanda').map((s: any) => ({ name: s.name, percentage: s.level }))
          },
          experience: experiencias.map((e: any) => ({
                title: e.cargo_titulo || 'Cargo',
                company: e.institucion_empresa || 'Empresa',
                date: `${e.fecha_inicio?.split('T')[0]} - ${e.fecha_fin ? e.fecha_fin.split('T')[0] : 'Presente'}`,
                description: e.descripcion || '',
          })),
          projects: proyectos.map((p: any) => ({
                title: p.titulo,
                description: p.descripcion,
                tags: p.tecnologias ? p.tecnologias.split(',') : []
          })),
          // Por defecto todo visible ya que el backend no lo incluyó en la respuesta del nuevo endpoint
          visibilidad: {
             proyectos_visible: true, habilidades_visible: true,
             experiencia_visible: true, redes_visible: true
          }
        };

        setData(mappedData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm w-full">
           <h2 className="text-xl font-bold text-gray-800 mb-2">404 No Encontrado</h2>
           <p className="text-gray-500">El portafolio que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return <PublicPortfolio data={data} />;
}
