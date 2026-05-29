// src/pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, FolderGit2, Globe, Layout, ShieldCheck, Sparkles, Terminal, Users } from 'lucide-react';
import '../index.css';
import { PublicHeader } from '../components/layout/PublicHeader'; // <-- Importar componente
import { startLandingTour, destroyActiveTour } from '../utils/tour';

export const LandingPage = () => {
  const navigate = useNavigate();

  // El estado isMenuOpen se mantiene si vas a usarlo posteriormente en un menú móvil en esta vista
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    // Iniciar el tour interactivo al cargar la página si no se ha visto antes
    startLandingTour();

    // Limpiar el tour si el componente se desmonta (navegación a otra página)
    return () => {
      destroyActiveTour();
    };
  }, []);

  // Función de navegación segura: destruye el tour antes de navegar
  const safeNavigate = (path: string) => {
    destroyActiveTour();
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* HEADER / NAVEGACIÓN IMPORTADO */}
      <PublicHeader />

      <main style={{ flexGrow: 1 }}>
        {/* HERO SECTION */}
        <section className="hero-section" id="tour-hero">
          {/* Contenedor enfocado para el tour (solo título + subtítulo + botones) */}
          <div id="tour-hero-content">
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
              <button className="btn-primary" onClick={() => safeNavigate('/register')} style={{ padding: '1rem 2rem'}}>Comenzar ahora<ArrowRight size={18} /></button>
              <button className="btn-ghost" onClick={() => startLandingTour(true)} style={{ padding: '1rem 2rem'}}>Repetir Tour</button>
            </div>
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
        <section id="tour-features" style={{ backgroundColor: 'var(--card)' }} className="section">
          {/* Encabezado enfocado para el tour */}
          <div className="text-center" id="tour-features-header">
            <h2 className="section-title">Todo lo que necesitas para destacar</h2>
            <p className="section-subtitle">
              Herramientas diseñadas específicamente para las necesidades de
              los ingenieros de software y profesionales de TI.
            </p>
          </div>

          <div className="grid-3">
             {/* Tarjetas de Features */}
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
        <section id="tour-how-it-works" className="section">
          {/* ... Todo el contenido original se mantiene intacto ... */}
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

        {/* SOBRE NOSOTROS */}
        <section id="About-Us" className="cta-section">
          {/* Contenedor enfocado para el tour CTA */}
          <div id="tour-cta-section">
            <h2 className="cta-title">¿Listo para destacar en la industria tech?</h2>
            <p className="cta-text">Únete a cientos de desarrolladores que ya están utilizando DevFolio para impulsar sus carreras profesionales.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button id="tour-cta" className="btn-primary" onClick={() => safeNavigate('/register')} style={{ padding: '1rem 2rem'}}>Crear mi portafolio gratis</button>
              <button className="btn-ghost" onClick={() => safeNavigate('/explorar')}>Explorar ejemplos</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} CSER S.R.L. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};