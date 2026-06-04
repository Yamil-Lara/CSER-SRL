import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { buildUrl } from '../utils/api';
import { PublicHeader } from '../components/layout/PublicHeader';
import { Card } from '../components/ui/Card';
import { Briefcase, GraduationCap, Calendar, Building, Eye, ArrowLeft } from 'lucide-react';
import { PortfolioData } from '../components/PublicPortfolio';

export default function PublicExperiencePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, experienceRes] = await Promise.all([
          api.get(`/portafolio/${username}`),
          api.get(`/portafolio/${username}/experiencias`)
        ]);

        const user = userRes.data.data.usuario;
        const experiencias = experienceRes.data.data || [];
        const visibilidad = userRes.data.data.visibilidad || {};
        
        // Si el usuario ocultó su experiencia, lo bloqueamos
        if (visibilidad && visibilidad.experiencia_visible === false) {
           setData(null);
           setLoading(false);
           return;
        }

        const mappedData: PortfolioData = {
          name: user.nombre,
          profession: user.profesion,
          bio: user.biografia,
          location: user.ubicacion,
          email: user.email,
          technologies: user.especialidad,
          skills: { technical: [], soft: [] },
          projects: [],
          socials: {},
          visibilidad: {
             proyectos_visible: true, habilidades_visible: true,
             experiencia_visible: true, redes_visible: true
          },
          // Mapeamos guardando también imagen y enlace
          experience: experiencias.map((e: any) => ({
                title: e.cargo_titulo || 'Cargo',
                company: e.institucion_empresa || 'Empresa',
                date: `${e.fecha_inicio?.split('T')[0]} - ${e.fecha_fin ? e.fecha_fin.split('T')[0] : 'Presente'}`,
                description: e.descripcion || '',
                isAcademic: e.tipo === 'academica',
                rawDate: e.fecha_inicio || '',
                imagen: e.imagen ? buildUrl(e.imagen) : undefined,
                enlace: e.enlace_certificado || undefined
          }))
        };

        setData(mappedData);
      } catch (err) {
        console.error('Error fetching experiences:', err);
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

  if (!data || !data.experience || data.experience.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm w-full">
           <h2 className="text-xl font-bold text-gray-800 mb-2">No disponible</h2>
           <p className="text-gray-500">La experiencia de este usuario no está disponible o es privada.</p>
           <button onClick={() => navigate(`/portfolio/${username}`)} className="mt-4 text-primary font-medium hover:underline">
             Volver al perfil
           </button>
        </div>
      </div>
    );
  }

  // Filtrar y ordenar
  const academicExp = data.experience.filter(e => e.isAcademic).sort((a, b) => new Date(b.rawDate || '').getTime() - new Date(a.rawDate || '').getTime());
  const workExp = data.experience.filter(e => !e.isAcademic).sort((a, b) => new Date(b.rawDate || '').getTime() - new Date(a.rawDate || '').getTime());

  // Componente reutilizable para renderizar un ítem de experiencia
  const ExperienceItem = ({ exp, icon: Icon, colorClass }: any) => (
    <div className={`relative pl-8 pb-8 border-l-2 ${colorClass} last:border-l-0 last:pb-0`}>
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-gray-200 dark:border-gray-700 ${colorClass.replace('border-', 'bg-').split('/')[0]}`} />
      
      <div className="mb-2">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>{exp.title}</h3>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
          <Building className="w-4 h-4" />
          <span className="font-medium">{exp.company}</span>
        </div>
      </div>
      
      <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium rounded border border-gray-200 dark:border-gray-700">
        <Calendar size={12} />
        <span>{exp.date}</span>
      </div>
      
      {exp.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-justify mb-4">
          {exp.description}
        </p>
      )}

      {/* Enlaces y Certificados */}
      <div className="flex flex-col gap-4 mt-2">
        
        {(exp as any).enlace && (
          <a 
            href={(exp as any).enlace} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors w-fit"
          >
            <Eye size={16} />
            Ver Certificado Digital
          </a>
        )}
        
        {(exp as any).imagen && (
          <div className="group relative w-full overflow-hidden rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1.5 transition-all hover:border-primary/40 dark:hover:border-primary/60 hover:shadow-sm">
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <img 
                src={(exp as any).imagen} 
                alt={`Certificado de ${exp.title}`} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <a 
                href={(exp as any).imagen} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-sm font-semibold gap-2 backdrop-blur-[2px]"
              >
                <Eye size={18} /> Ampliar documento
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
  
  // Usamos el icono de lucide para la imagen
  const ImageIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  );

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900" style={{ backgroundColor: 'var(--bg-color)' }}>
      <PublicHeader />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <button 
          onClick={() => navigate(`/portfolio/${username}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Volver al perfil de {data.name}
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-main)' }}>Trayectoria Profesional</h1>

        {academicExp.length > 0 && (
          <Card className="card shadow-sm mb-8 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-accent/20 text-accent p-3 rounded-xl">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Formación Académica</h2>
            </div>
            <div className="space-y-4">
              {academicExp.map((exp, idx) => (
                <ExperienceItem key={`acad-${idx}`} exp={exp} icon={GraduationCap} colorClass="border-accent/40" />
              ))}
            </div>
          </Card>
        )}

        {workExp.length > 0 && (
          <Card className="card shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/20 text-primary p-3 rounded-xl">
                <Briefcase size={24} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Experiencia Laboral</h2>
            </div>
            <div className="space-y-4">
              {workExp.map((exp, idx) => (
                <ExperienceItem key={`work-${idx}`} exp={exp} icon={Briefcase} colorClass="border-primary/40" />
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}