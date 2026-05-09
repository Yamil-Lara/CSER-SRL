// src/components/layout/PublicHeader.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmpresa from "../../assets/logo.png"; // Ajusta la ruta del logo si es necesario
import { useAuth } from '../../context/AuthContext';

export const PublicHeader = () => {
  const navigate = useNavigate();
  // Extraemos isAdmin además de isAuthenticated y logout
  const { isAuthenticated, logout, isAdmin } = useAuth(); 

  // Estado para manejar el scroll del Header
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar el scroll y cambiar el tamaño/fondo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica del Tema Oscuro/Claro con memoria (localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('devfolio-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
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

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    await logout();
    navigate('/'); 
  };

  return (
    <header
      className={`navbar fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'py-3 dark:bg-white/0 backdrop-blur-md shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="flex items-center justify-start gap-2">
        <img src={logoEmpresa} alt="Logo de DevFolio" className="w-16 h-auto" />
        <a href="#top" className="logo">DevFolio</a>
      </div>

      <div className="nav-links">
        <a href="/#features">Características</a>
        <a onClick={() => navigate('/explorar')} style={{ cursor: 'pointer' }}>Explorar</a>
        <a href="/#how-it-works">Cómo Funciona</a>
        <a href="/#About-Us">Nosotros</a>
      </div>

      <div className="nav-actions">
        {/* Lógica de renderizado condicional por rol */}
        {isAuthenticated ? (
          <>
            {isAdmin ? (
              // Botón para Administrador
              <button className="btn-ghost" onClick={() => navigate('/admin/dashboard')}>
                Vista Global
              </button>
            ) : (
              // Botón para Usuario Normal
              <button className="btn-ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
            )}
            
            <button className="btn-primary-small" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>
            <button className="btn-primary-small" onClick={() => navigate('/register')}>
              Regístrate Gratis
            </button>
          </>
        )}
        
        {/* BOTÓN DE CAMBIO DE TEMA */}
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Cambiar tema">
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"/></svg>
          )}
        </button>
      </div>
    </header>
  );
};