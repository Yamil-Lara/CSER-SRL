// src/pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, FolderGit2, Globe, Layout, ShieldCheck, Sparkles, Terminal, Users } from 'lucide-react';
import '../index.css';
import logoEmpresa from "../assets/logo.png";

export const LandingPage = () => {
  const navigate = useNavigate();

  // Lógica del Tema Oscuro/Claro con memoria (localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 1. Prioridad 1: Leer lo que el usuario eligió antes
    const savedTheme = localStorage.getItem('devfolio-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // 2. Prioridad 2: Leer el sistema
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
      // Guardar elección en la memoria del navegador
      localStorage.setItem('devfolio-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.removeAttribute('data-theme');
      // Guardar elección en la memoria del navegador
      localStorage.setItem('devfolio-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Función para redirigir al Dashboard
  const handleLoginClick = () => {
  navigate('/login');  // esto fue modificado por javi xd
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* HEADER / NAVEGACIÓN */}
      <nav className="navbar">
        <div className="flex items-center justify-start gap-2">
          {/* Usa la variable importada en el atributo src */}
          <img src={logoEmpresa} alt="Logo de DevFolio" className="w-16 h-auto" />
          <span className="logo">DevFolio</span>
        </div>

        <div className="nav-links">
          <a href="#features">Características</a>
          <a onClick={() => navigate('/explorar')} style={{ cursor: 'pointer' }}>Explorar</a>
          <a href="#how-it-works">Cómo Funciona</a>
          <a href="#About-Us">Nosotros</a>
        </div>

        <div className="nav-actions">
          {/* BOTÓN CON REDIRECCIÓN AL DASHBOARD */}
          <button className="btn-ghost" onClick={handleLoginClick}>Iniciar Sesión</button>

          <button className="btn-primary-small" onClick={() => navigate('/login')}>Regístrate Gratis</button>
          {/* BOTÓN DE CAMBIO DE TEMA */}
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Cambiar tema">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </nav>

      <main style={{ flexGrow: 1 }}>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="badge">
            <Sparkles size={16} />
            <span>La nueva forma de mostrar tu código</span>
          </div>

          <h1 className="hero-title">
            Construye tu marca personal como <br />
            <span className="text-gradient">desarrollador</span>
          </h1>

          <p className="hero-subtitle">
            Crea, gestiona y comparte tu portafolio profesional en minutos.
            Destaca tus proyectos, habilidades técnicas y experiencia para
            conseguir tu próximo gran empleo.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Comenzar ahora
              <ArrowRight size={18} />
            </button>
            <button className="btn-ghost" style={{ border: '1px solid var(--muted)', borderRadius: '8px' }}>
              Ver demostración
            </button>
          </div>

          {/* MOCKUP DE TERMINAL */}
          <div className="mockup-container">
            <div className="mockup-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="mockup-body">
              <Terminal size={64} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }} />
              <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                Vista previa del portafolio interactivo
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" style={{ backgroundColor: 'var(--card)' }} className="section">
          <div className="text-center">
            <h2 className="section-title">Todo lo que necesitas para destacar</h2>
            <p className="section-subtitle">
              Herramientas diseñadas específicamente para las necesidades de
              los ingenieros de software y profesionales de TI.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon icon-primary"><FolderGit2 size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Gestión de Proyectos</h3>
              <p style={{ color: 'var(--text-muted)' }}>Documenta tus proyectos con descripciones detalladas, tecnologías utilizadas y demos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-accent"><Code size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Habilidades Técnicas</h3>
              <p style={{ color: 'var(--text-muted)' }}>Organiza tus lenguajes y frameworks con indicadores visuales de tu experiencia.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-primary"><Globe size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Portafolio Público</h3>
              <p style={{ color: 'var(--text-muted)' }}>Obtén una URL única y profesional para compartir tu perfil y controla tu privacidad.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-accent"><Users size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Red Profesional</h3>
              <p style={{ color: 'var(--text-muted)' }}>Integra GitHub, LinkedIn y recibe validaciones de otros profesionales.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-primary"><Layout size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Diseño Responsive</h3>
              <p style={{ color: 'var(--text-muted)' }}>Tu portafolio se verá increíble en monitores ultrawide y teléfonos móviles.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon icon-accent"><ShieldCheck size={24} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Seguridad y Privacidad</h3>
              <p style={{ color: 'var(--text-muted)' }}>Exporta tu información a PDF y mantén el control total de tus datos.</p>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="how-it-works" className="section">
          <div className="text-center mb-6">
            <h2 className="section-title">Cómo funciona</h2>
            <p className="section-subtitle">
              Tres simples pasos para llevar tu presencia profesional al siguiente nivel.
            </p>
          </div>

          <div className="grid-3" style={{ position: 'relative' }}>
            <div className="step-card">
              <div className="step-number c-primary">1</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Crea tu cuenta</h3>
              <p style={{ color: 'var(--text-muted)' }}>Regístrate en segundos y configura tu biografía y enlaces a redes sociales.</p>
            </div>
            <div className="step-card">
              <div className="step-number c-primary">2</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Añade tu experiencia</h3>
              <p style={{ color: 'var(--text-muted)' }}>Documenta tus proyectos, habilidades técnicas y formación académica.</p>
            </div>
            <div className="step-card">
              <div className="step-number c-accent">3</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Comparte al mundo</h3>
              <p style={{ color: 'var(--text-muted)' }}>Publica tu portafolio y compártelo con reclutadores o la comunidad.</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="About-Us" className="cta-section">
          <h2 className="cta-title">¿Listo para destacar en la industria tech?</h2>
          <p className="cta-text">Únete a cientos de desarrolladores que ya están utilizando DevFolio para impulsar sus carreras profesionales.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ padding: '1rem 2rem' }}>Crear mi portafolio gratis</button>
            <button className="btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Explorar ejemplos</button>
          </div>
        </section>
      </main>
    </div>
  );
};