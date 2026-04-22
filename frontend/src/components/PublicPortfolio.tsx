import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { 
  Code2, LayoutDashboard, LogOut, ArrowLeft, 
  MapPin, Mail, Code, Briefcase, FolderGit2, Image as ImageIcon
} from 'lucide-react';
import { FiLinkedin, FiGithub } from 'react-icons/fi';

export interface PortfolioData {
  name: string;
  profession: string;
  technologies: string;
  bio: string;
  location: string;
  email: string;
  socials: {
    linkedin: string;
    github: string;
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
    title: string;
    description: string;
    tags: string[];
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

  // Helper para sacar la inicial
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  const vis = data.visibilidad;
  const anyVisible = vis.proyectos_visible || vis.habilidades_visible || vis.experiencia_visible;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--bg-color)' }}>
      
      {/* Header Recreado */}
      <header className="card border-b z-10 relative">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl text-primary flex items-center justify-center">
              <Code2 size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-main)' }}>DevFolio</span>
          </div>

          {/* Nav Central */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-muted hover:text-primary transition-colors cursor-pointer">Inicio</Link>
            <Link to="/explore" className="text-muted hover:text-primary transition-colors cursor-pointer">Explorar</Link>
            <Link to={`/portfolio/${localStorage.getItem('username') || ''}`} className="font-semibold cursor-pointer" style={{ color: 'var(--text-main)' }}>Mi Portafolio</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard/perfil')} 
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted hover:bg-black/5 hover:text-primary px-3 py-2 rounded-md transition-colors cursor-pointer dark:hover:bg-white/10"
            >
              <LayoutDashboard size={18} />
              <span>Mi Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-sm font-medium text-muted hover:bg-destructive/10 hover:text-destructive px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Back button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>

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
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold">
                {getInitial(data.name)}
              </div>
              
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
                  <div className="flex gap-3">
                    <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiLinkedin size={20} />
                    </a>
                    <a href={data.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiGithub size={20} />
                    </a>
                    <a href={data.socials.sitio_web} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiLinkedin size={20} />
                    </a>
                    <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiGithub size={20} />
                    </a>
                    <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiLinkedin size={20} />
                    </a>
                    <a href={data.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiGithub size={20} />
                    </a>
                    <a href={data.socials.sitio_web} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiLinkedin size={20} />
                    </a>
                    <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <FiGithub size={20} />
                    </a>
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
                    <div key={idx} className="card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border">
                      <div className="rounded-lg h-32 w-full mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--muted)', color: 'var(--text-muted)' }}>
                        <ImageIcon size={32} />
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
