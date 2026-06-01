import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { buildUrl } from '../utils/api';
import PublicPortfolio, { PortfolioData } from '../components/PublicPortfolio';

export default function PortfolioPublico() {
  const { username } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, projectsRes, experienceRes, skillsRes] = await Promise.all([
          api.get(`/portafolio/${username}`),
          api.get(`/portafolio/${username}/proyectos`),
          api.get(`/portafolio/${username}/experiencias`),
          api.get(`/portafolio/${username}/habilidades`)
        ]);

        const user = userRes.data.data.usuario;
        const redes = userRes.data.data.redes_sociales || {};
        const proyectos = projectsRes.data.data || [];
        const experiencias = experienceRes.data.data || [];
        const habilidades = skillsRes.data.data || [];
        
        const mappedData: PortfolioData = {
          name: user.nombre,
          photo: buildUrl(user.foto),
          profession: user.profesion,
          technologies: user.especialidad,
          bio: user.biografia,
          university: user.universidad,
          career: user.carrera,
          location: user.ubicacion,
          email: user.email,
          socials: {
            linkedin: redes.linkedin,
            github: redes.github,
            website: redes.sitio_web,
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
                isAcademic: e.tipo === 'academica',
                rawDate: e.fecha_inicio || ''
          })),
          projects: proyectos.map((p: any) => {
                let parsedTags: string[] = [];
                if (p.tecnologias) {
                   try {
                       parsedTags = p.tecnologias.startsWith('[') ? JSON.parse(p.tecnologias) : p.tecnologias.split(',');
                   } catch {
                       parsedTags = [];
                   }
                }
                
                let parsedTools: string[] = [];
                if (p.herramientas) {
                   parsedTools = p.herramientas.split(',');
                }

                return {
                    id: p.id,
                    title: p.titulo,
                    description: p.descripcion,
                    tags: parsedTags.map((t: string) => t.trim()).filter(Boolean),
                    tools: parsedTools.map((t: string) => t.trim()).filter(Boolean),
                    image: buildUrl(p.imagen)
                };
          }),
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
    api.post(`/portafolio/${username}/visita`).catch((err) => {
      console.warn('[visita]', err?.response?.data?.message ?? err?.message);
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