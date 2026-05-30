// src/components/layout/PublicHeader.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmpresa from "../../assets/logo.png"; 
import { useAuth } from '../../context/AuthContext';

export const PublicHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  
  // Referencia para detectar clics fuera del menú
  const menuRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Efecto para manejar el scroll y cerrar el menú al desplazar
  useEffect(() => {
    const handleScroll = () => {
      // Cambia el estado del header por el scroll
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Cierra el menú móvil si el usuario hace scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // 2. Efecto para cerrar el menú al hacer clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Lógica del Tema (Oscuro/Claro)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('devfolio-theme');
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('devfolio-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('devfolio-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`navbar fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'py-3 dark:bg-white/0 backdrop-blur-md shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      {/* BARRA SUPERIOR PRINCIPAL */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center justify-start gap-2">
          <img src={logoEmpresa} alt="Logo de DevFolio" className="w-16 h-auto" />
          <a href="/#top" className="logo text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>DevFolio</a>
        </div>

        {/* CONTENEDOR MÓVIL: Botón Tema Oscuro + Menú Hamburguesa */}
        <div className="flex items-center gap-2 md:hidden">
          {/* BOTÓN DE TEMA (Visible solo en móvil, junto al menú hamburguesa) */}
          <button onClick={toggleTheme} className="theme-toggle-btn p-2" aria-label="Cambiar tema">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/></svg>
            )}
          </button>

          <button 
            className="p-2 text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* MENÚ COLAPSABLE (Links y Acciones) */}
      <div 
        className={`w-full md:w-auto md:flex-1 md:flex md:items-center md:justify-between transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen 
            ? 'flex flex-col mt-2 bg-white backdrop-blur-md rounded-2xl shadow-xl p-6 absolute top-full left-0 right-0 mx-4 md:static md:mx-0 md:bg-transparent md:dark:bg-transparent md:p-0 md:shadow-none md:mt-0' 
            : 'hidden md:flex md:mt-0 bg-transparent'
        }`}
      >
        <div className="nav-links flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 md:mx-auto w-full md:w-auto">
          <a href="/#tour-features" onClick={() => setIsMobileMenuOpen(false)}>Características</a>
          <a onClick={() => handleNavigation('/explorar')} style={{ cursor: 'pointer' }}>Explorar</a>
          <a href="/#tour-how-it-works" onClick={() => setIsMobileMenuOpen(false)}>Cómo Funciona</a>
          <a href="/#About-Us" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</a>
        </div>

        <div className="nav-actions flex flex-col md:flex-row items-center justify-center gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-gray-700 w-full md:w-auto">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <button className="btn-ghost flex justify-center items-center" onClick={() => handleNavigation('/dashboard')}>
                  Vista Global
                </button>
              ) : (
                <button className="btn-ghost flex justify-center items-center" onClick={() => handleNavigation('/dashboard')}>
                  Dashboard
                </button>
              )}
              <button className="btn-primary-small flex justify-center items-center" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost flex justify-center items-center" onClick={() => handleNavigation('/login')}>
                Iniciar Sesión
              </button>
              <button className="btn-primary-small flex justify-center items-center" onClick={() => handleNavigation('/register')}>
                Regístrate Gratis
              </button>
            </>
          )}
          
          {/* BOTÓN DE TEMA PARA ESCRITORIO (Envuelto en un div oculto en móvil) */}
          <div className="hidden md:flex items-center">
            <button onClick={toggleTheme} className="theme-toggle-btn p-2" aria-label="Cambiar tema">
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/></svg>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};