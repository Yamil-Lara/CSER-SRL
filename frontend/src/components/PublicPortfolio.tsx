import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { 
  Code2, MapPin, Mail, Code, Briefcase, FolderGit2, Image as ImageIcon, Moon, Sun
} from 'lucide-react';
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
  }[];
  projects: {
    id: number;
    title: string;
    description: string;
    tags: string[];
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
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.removeAttribute('data-theme');
      localStorage.setItem('devfolio-theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('devfolio-theme', 'dark');
      setIsDark(true);
    }
  };

  // Helper para sacar la inicial
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  const vis = data.visibilidad;
  const anyVisible = vis.proyectos_visible || vis.habilidades_visible || vis.experiencia_visible;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--bg-color)' }}>
      
      {/* Header Recreado para Vista Pública */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-slate-200 z-10 relative">
        <div className="text-2xl font-extrabold text-[#3B82F6] cursor-pointer" onClick={() => navigate('/')}>DevFolio</div>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-[#3B82F6]">Características</a>
          <a href="#" className="text-[#3B82F6] font-semibold" onClick={() => navigate('/explore')}>Explorar</a>
          <a href="#" className="hover:text-[#3B82F6]">Cómo Funciona</a>
          <a href="#" className="hover:text-[#3B82F6]">Nosotros</a>
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-medium text-slate-700" onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">Regístrate Gratis</button>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 text-slate-600">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        


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
                <div className="text-primary text-base sm:text-lg font-medium mb-1">{data.profession}</div>
                <p className="text-muted text-sm mb-4">{data.technologies}</p>
                
                <p className="text-sm sm:text-base mb-6 leading-relaxed" style={{ color: 'var(--text-main)' }}>
                  {data.bio}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted mb-6">
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
                      <div className="flex flex-wrap gap-2">
                        {proj.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-1 bg-primary/20 text-primary font-medium text-[10px] rounded whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 text-primary p-2 rounded-lg">
                    <Briefcase size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Experiencia</h2>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[6px] before:w-[2px] before:-translate-x-px before:bg-gray-200">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6">
                      <div className="absolute left-[3px] w-2 h-2 rounded-sm bg-primary top-1.5 ring-4 ring-white shadow-sm -translate-x-[2px]"></div>
                      
                      <h3 className="text-sm font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-xs text-gray-600 mt-0.5 mb-2">{exp.company}</p>
                      
                      <div className="inline-flex items-center gap-1.5 mb-3 px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-medium rounded border border-gray-100 truncate">
                        <Briefcase size={10} />
                        <span>{exp.date}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line text-justify pr-2">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>
        )}
      </main>
    </div>
  );
}