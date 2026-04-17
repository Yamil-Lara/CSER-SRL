import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { 
  Code2, LayoutDashboard, LogOut, ArrowLeft, 
  MapPin, Mail, Code, Briefcase
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

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
}

interface PublicPortfolioProps {
  data: PortfolioData;
}

export default function PublicPortfolio({ data }: PublicPortfolioProps) {
  const navigate = useNavigate();

  // Helper para sacar la inicial
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* Header Recreado */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary flex items-center justify-center">
              <Code2 size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">DevFolio</span>
          </div>

          {/* Nav Central */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Inicio</Link>
            <span className="text-primary font-semibold">Mi Portafolio</span>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard/experiencia')} 
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              <LayoutDashboard size={18} />
              <span>Mi Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-destructive transition-colors"
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
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>

        <div className="flex flex-col gap-6">
          
          {/* 1. Perfil Card */}
          <Card className="flex flex-col sm:flex-row gap-6 items-start border-gray-200 shadow-sm">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-blue-50 text-primary rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold">
              {getInitial(data.name)}
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{data.name}</h1>
              <h2 className="text-primary text-base sm:text-lg font-medium mb-1">{data.profession}</h2>
              <p className="text-gray-500 text-sm mb-4">{data.technologies}</p>
              
              <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed">
                {data.bio}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{data.email}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FaLinkedin size={20} />
                </a>
                <a href={data.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FaGithub size={20} />
                </a>
              </div>
            </div>
          </Card>

          {/* 2. Habilidades Card */}
          <Card className="border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 text-primary p-2 rounded-lg">
                <Code size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Habilidades</h2>
            </div>

            <div className="space-y-6">
              {/* Técnicas */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Técnicas</h3>
                <div className="space-y-4">
                  {data.skills.technical.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.percentage} %</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blandas */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Blandas</h3>
                <div className="space-y-4">
                  {data.skills.soft.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.percentage} %</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Experiencia Card */}
          <Card className="border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 text-primary p-2 rounded-lg">
                <Briefcase size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Experiencia</h2>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[6px] before:w-[2px] before:-translate-x-px before:bg-gray-200">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-8">
                  <div className={`absolute left-0 w-3 h-3 rounded-sm ${exp.isAcademic ? 'bg-primary' : 'bg-primary'} top-1.5 ring-4 ring-white`}></div>
                  
                  <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5 mb-2">{exp.company}</p>
                  
                  <div className="inline-flex items-center gap-2 mb-3 px-2 py-0.5 bg-gray-50 text-gray-500 text-xs font-medium rounded border border-gray-100">
                    <Briefcase size={12} />
                    <span>{exp.date}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}
