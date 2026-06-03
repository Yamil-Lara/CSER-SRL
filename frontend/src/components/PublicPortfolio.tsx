import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/Card';
import { 
  Code2, MapPin, Mail, Code, Briefcase, FolderGit2, Image as ImageIcon, GraduationCap, Calendar 
} from 'lucide-react';
import { PublicHeader } from './layout/PublicHeader';
import { FaLinkedin, FaGithub, FaGlobe, FaFacebook, FaInstagram, FaXTwitter, FaTiktok, FaThreads } from 'react-icons/fa6';

// Workaround para TypeScript
const LinkedinIcon = FaLinkedin as React.ElementType;
const GithubIcon = FaGithub as React.ElementType;
const GlobeIcon = FaGlobe as React.ElementType;
const FacebookIcon = FaFacebook as React.ElementType;
const InstagramIcon = FaInstagram as React.ElementType;
const TwitterIcon = FaXTwitter as React.ElementType;
const TiktokIcon = FaTiktok as React.ElementType;
const ThreadsIcon = FaThreads as React.ElementType;

export interface PortfolioData {
  name: string;
  photo?: string;
  profession: string;
  technologies: string;
  bio: string;
  university?: string;
  career?: string;
  location: string;
  email: string;
  socials: {
    linkedin?: string;
    github?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    threads?: string;
  };
  skills: {
    technical: { name: string; percentage: number }[];
    soft: { name: string; percentage: number }[];
  };
  experience: {
    title: string;
    company: string;
    date: string;
    description: string;
    isAcademic?: boolean;
    rawDate?: string;
  }[];
  projects: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    tools?: string[];
    image?: string;
  }[];
  visibilidad: {
    proyectos_visible: boolean;
    habilidades_visible: boolean;
    experiencia_visible: boolean;
    redes_visible: boolean;
  };
}

interface PublicPortfolioProps {
  data: PortfolioData;
}

export default function PublicPortfolio({ data }: PublicPortfolioProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  // Helper para sacar la inicial
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  const vis = data.visibilidad || {};
  const anyVisible = vis.proyectos_visible || vis.habilidades_visible || vis.experiencia_visible;

  // LÓGICA DE FILTRADO CORREGIDA
  const academicExperiences = data.experience?.filter(exp => exp.isAcademic) || [];
  
  // Función para extraer la fecha final y darle valor máximo a "Presente"
  const getEndDateForSorting = (dateString: string = '') => {
    // Separamos el string por " - " para obtener la fecha de inicio y fin
    const parts = dateString.split(' - ');
    const endPart = parts.length > 1 ? parts[1].trim() : dateString.trim();
    
    // Si la fecha de fin es "Presente", devolvemos una fecha muy futura para que siempre quede primero
    if (endPart.toLowerCase().includes('presente')) {
      return '9999-12-31';
    }
    
    return endPart;
  };

  // Ordenamos usando la fecha de fin
  const latestAcademicExperience = academicExperiences.sort((a, b) => {
    const endA = getEndDateForSorting(a.date);
    const endB = getEndDateForSorting(b.date);
    return endB.localeCompare(endA);
  })[0];

  // Filtramos las experiencias laborales para la sección inferior
  const workExperiences = data.experience?.filter(exp => !exp.isAcademic) || [];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--bg-color)' }}>
      
      {/* Header Recreado para Vista Pública */}
      <PublicHeader />

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-8">
        {!anyVisible ? (
          <div className="card flex flex-col items-center justify-center p-12 rounded-2xl shadow-sm mt-8 text-center">
            <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--muted)', color: 'var(--text-muted)' }}>
              <Code size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Este usuario no tiene información pública disponible</h2>
            <p className="text-muted max-w-md">El propietario de este portafolio ha decidido mantener sus secciones privadas temporalmente a través de sus opciones de visibilidad.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* 1. Perfil Card */}
            <Card className="card flex flex-col sm:flex-row gap-6 items-start shadow-sm">
              {data.photo ? (
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-sm">
                  <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-sm">
                  {getInitial(data.name)}
                </div>
              )}
              
              <div className="flex flex-col w-full">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{data.name}</h1>
                <div className="text-primary text-base sm:text-lg font-medium">{data.profession}</div>
                <p className="text-sm sm:text-base text-gray-500">{data.technologies}</p>
                
                <p className="text-sm sm:text-base leading-relaxed mb-1" style={{ color: 'var(--text-main)' }}>
                  {data.bio}
                </p>
                
                {latestAcademicExperience && (
                  <div className="mb-3">
                    <p className="text-primary text-base sm:text-lg font-medium">
                      Formación Académica
                    </p>
                    
                    <div>
                      <div className="font-bold sm:text-base text-gray-800 text-sm" style={{ color: 'var(--text-main)' }}>{latestAcademicExperience.title}</div>
                      <div className="text-sm sm:text-base text-gray-500">{latestAcademicExperience.company}</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-7 text-sm text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{data.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{data.email}</span>
                  </div>
                </div>

                {vis.redes_visible && (
                  <div className="flex gap-3 flex-wrap">
                    {data.socials.linkedin && data.socials.linkedin !== '#' && (
                      <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <LinkedinIcon size={20} />
                      </a>
                    )}
                    {data.socials.github && data.socials.github !== '#' && (
                      <a href={data.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <GithubIcon size={20} />
                      </a>
                    )}
                    {data.socials.website && (
                      <a href={data.socials.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <GlobeIcon size={20} />
                      </a>
                    )}
                    {data.socials.facebook && (
                      <a href={data.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <FacebookIcon size={20} />
                      </a>
                    )}
                    {data.socials.twitter && (
                      <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <TwitterIcon size={20} />
                      </a>
                    )}
                    {data.socials.instagram && (
                      <a href={data.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <InstagramIcon size={20} />
                      </a>
                    )}
                    {data.socials.threads && (
                      <a href={data.socials.threads} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <ThreadsIcon size={20} />
                      </a>
                    )}
                    {data.socials.tiktok && (
                      <a href={data.socials.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <TiktokIcon size={20} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Nueva Sección Proyectos Renderizado Condicional */}
            {vis.proyectos_visible && data.projects && data.projects.length > 0 && (
              <Card className="card shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/20 text-primary p-2 rounded-lg">
                    <FolderGit2 size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Proyectos</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((proj, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/proyecto/${proj.id}`)}
                      className="card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border cursor-pointer hover:-translate-y-1 duration-200"
                    >
                      <div className="rounded-lg h-32 w-full mb-4 flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--muted)', color: 'var(--text-muted)' }}>
                        {proj.image ? (
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={32} />
                        )}
                      </div>
                      <h3 className="text-sm font-bold mb-2">{proj.title}</h3>
                      <p className="text-muted text-xs mb-4 line-clamp-3 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-col gap-2 mt-auto">
                        {proj.tags && proj.tags.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tecnologías</span>
                            <div className="flex flex-wrap gap-1.5">
                              {proj.tags.map((tag, tIdx) => (
                                <span key={`tech-${tIdx}`} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 font-medium text-[10px] rounded-sm whitespace-nowrap">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {proj.tools && proj.tools.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Herramientas</span>
                            <div className="flex flex-wrap gap-1.5">
                              {proj.tools.map((tool, tIdx) => (
                                <span key={`tool-${tIdx}`} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium text-[10px] rounded-sm whitespace-nowrap">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 2. Habilidades Card */}
            {vis.habilidades_visible && data.skills && (data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
              <Card className="card shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/20 text-primary p-2 rounded-lg">
                    <Code size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Habilidades</h2>
                </div>

                <div className="space-y-6">
                  {/* Técnicas */}
                  {data.skills.technical.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Técnicas</h3>
                      <div className="space-y-4">
                        {data.skills.technical.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-muted">{skill.percentage} %</span>
                            </div>
                            <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--muted)' }}>
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blandas */}
                  {data.skills.soft.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Blandas</h3>
                      <div className="space-y-4">
                        {data.skills.soft.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-muted">{skill.percentage} %</span>
                            </div>
                            <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--muted)' }}>
                              <div className="bg-[#10b981] h-1.5 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 3. Experiencia Card */}
            {vis.experiencia_visible && data.experience && data.experience.length > 0 && (
              <Card className="card shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-lg">
                      <Briefcase size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900" style={{ color: 'var(--text-main)' }}>Experiencia</h2>
                  </div>
                  
                  {/* Botón hacia la pestaña de certificados */}
                  <button 
                    onClick={() => navigate(`/portfolio/${username}/experiencia`)}
                    className="text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit border border-primary/10"
                  >
                    Ver certificados y enlaces &rarr;
                  </button>
                </div>

                <div className="mt-2">
                  {data.experience.map((exp, index) => {
                    const borderColor = exp.isAcademic ? 'border-accent/40' : 'border-primary/40';
                    const dotColor = exp.isAcademic ? 'bg-accent' : 'bg-primary';

                    return (
                      <div key={index} className={`relative pl-8 pb-8 border-l-2 ${borderColor} last:border-l-transparent last:pb-0`}>
                        <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-gray-200 dark:border-gray-700 ${dotColor}`} />
                        
                        <div className="flex flex-wrap items-center gap-2 mb-1 -mt-1.5">
                          <h3 className="font-bold sm:text-base text-sm" style={{ color: 'var(--text-main)' }}>
                            {exp.title}
                          </h3>
                          {exp.isAcademic ? (
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded border border-accent/20 uppercase tracking-wide">
                              Académico
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded border border-primary/20 uppercase tracking-wide">
                              Laboral
                            </span>
                          )}
                        </div>
                        
                        {/* Adaptación para la Empresa */}
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">{exp.company}</p>
                        
                        {/* Adaptación para la Fecha */}
                        <div className="inline-flex items-center gap-1.5 mb-3 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-[10px] font-medium rounded border border-gray-100 dark:border-gray-700 truncate">
                          <Briefcase size={10} />
                          <span>{exp.date}</span>
                        </div>
                        
                        {/* Adaptación para la Descripción */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line text-justify pr-2 text-[12px]">
                          {exp.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}