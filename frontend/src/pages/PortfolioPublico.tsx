import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PublicPortfolio, { PortfolioData } from '../components/PublicPortfolio';

export default function PortfolioPublico() {
  const { username } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LLamada Real de Axios (HU-06 x HU-08)
    axios.get(`http://localhost:8000/api/portafolio/${username}`)
      .then(res => {
        const user = res.data.user;
        
        // Mapeo seguro de backend a la interfaz
        const mappedData: PortfolioData = {
          name: user.nombre,
          profession: user.profesion || 'Desarrollador Full Stack',
          technologies: user.especialidad || 'React & Node.js',
          bio: user.biografia || 'Apasionada por crear experiencias web increíbles',
          location: user.ubicacion || 'La Paz, Bolivia',
          email: user.email,
          socials: {
            linkedin: user.linkedin || '#',
            github: user.github_perfil || '#',
          },
          skills: {
            // Ajustamos skills si vienen o usamos mock
            technical: user.skills && user.skills.length > 0
              ? user.skills.filter((s:any) => s.type === 'tecnica').map((s: any) => ({ name: s.name || s.nombre || 'Skill', percentage: s.level || s.porcentaje || s.nivel || 80 }))
              : [
                { name: 'Node.js', percentage: 100 },
                { name: 'java', percentage: 39 }
              ],
            soft: user.skills && user.skills.length > 0
              ? user.skills.filter((s:any) => s.type === 'blanda').map((s: any) => ({ name: s.name || s.nombre || 'Skill', percentage: s.level || s.porcentaje || s.nivel || 80 }))
              : [
                { name: 'Comunicacion', percentage: 70 },
                { name: 'liderazgo', percentage: 57 }
            ]
          },
          experience: user.experiencias && user.experiencias.length > 0
            ? user.experiencias.map((e: any) => {
                const fInicio = e.fecha_inicio ? e.fecha_inicio.split('T')[0] : '';
                const fFin = e.fecha_fin ? e.fecha_fin.split('T')[0] : 'Presente';
                return {
                  title: e.cargo_titulo || e.cargo || e.title || 'Cargo',
                  company: e.institucion_empresa || e.empresa || e.company || 'Empresa',
                  date: `${fInicio} - ${fFin}`,
                  description: e.descripcion || e.description || '',
                };
              })
            : [
                {
                  title: 'Ingeniera de Sistemas',
                  company: 'UMSS',
                  date: 'jun 2010 - ago 2016',
                  description: 'Desarrollador Full Stack crear aplicaciones web completas, trabajando tanto en el frontend (interfaz de usuario) como en el backend (lógica del servidor, API y bases de datos).'
                },
                {
                  title: 'Analista de sistemas',
                  company: 'Banco Mercantil Santa Cruz',
                  date: 'sept 2017 - Presente',
                  description: 'dando soporte de datos al sistema'
                }
            ],
          projects: user.proyectos && user.proyectos.length > 0
            ? user.proyectos.map((p: any) => ({
                title: p.titulo || p.nombre || 'Proyecto',
                description: p.descripcion || p.description || '',
                tags: p.tecnologias ? p.tecnologias.split(',') : ['react']
              }))
            : [
                {
                  title: 'robot vionico',
                  description: 'máquina avanzada que imita la estructura, movimiento y funciones de los seres vivos...',
                  tags: ['react', 'node.js']
                },
                {
                  title: 'aplicación de banca móvil',
                  description: 'es una herramienta digital segura proporcionada por instituciones financiera...',
                  tags: ['Swift (iOS)', 'Kotlin/Java (Android)', 'SQL']
                }
            ],
          visibilidad: user.visibilidad ? {
             proyectos_visible: Boolean(user.visibilidad.proyectos_visible),
             habilidades_visible: Boolean(user.visibilidad.habilidades_visible),
             experiencia_visible: Boolean(user.visibilidad.experiencia_visible),
             redes_visible: Boolean(user.visibilidad.redes_visible)
          } : {
             proyectos_visible: true,
             habilidades_visible: true,
             experiencia_visible: true,
             redes_visible: true
          }
        };

        setData(mappedData);
      })
      .catch(err => {
        console.error('Error fetching portfolio:', err);
      })
      .finally(() => {
        setLoading(false);
      });

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
