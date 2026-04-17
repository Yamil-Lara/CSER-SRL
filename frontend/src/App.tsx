// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExperiencePage } from "./pages/ExperiencePage";
import Sidebar from "./components/Sidebar";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import UserProfile from "./components/UserProfile";
import { LandingPage } from "./pages/LandingPage"; 
import PortfolioPublico from "./pages/PortfolioPublico";
import LinksPage from "./pages/LinksPage"; 
import { VisibilitySettingsPage } from "./pages/VisibilitySettingsPage";
import ExplorePage from "./pages/ExplorePage";

const App = (): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      const htmlElement = document.documentElement;
      if (isDark) {
        htmlElement.classList.add('dark');
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.removeAttribute('data-theme');
      }
    };

    // 1. Revisar si el usuario ya guardó una preferencia antes
    const savedTheme = localStorage.getItem('devfolio-theme');

    if (savedTheme) {
      // Si hay una preferencia guardada, respetarla siempre
      applyTheme(savedTheme === 'dark');
    } else {
      // 2. Si es la primera vez que entra, usar el tema de su sistema operativo
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(darkModeQuery.matches);
    }

    // Escuchar cambios del sistema (solo aplicará si el usuario no ha forzado un tema manualmente)
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('devfolio-theme')) {
        applyTheme(e.matches);
      }
    };
    darkModeQuery.addEventListener('change', handleChange);

    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta principal: ahora carga la Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />

          {/* Redirección del login temporalmente al dashboard */}
          <Route path="/login" element={<Navigate to="/dashboard/perfil" />} />

          {/* Rutas Privadas / Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                <main className="main-content">
                  <Routes>
                    <Route path="perfil" element={<UserProfile />} />
                    <Route path="proyectos" element={<ProjectsPage />} />
                    <Route path="habilidades" element={<SkillsPage />} />                  
                    <Route path="experiencia" element={<ExperiencePage />} />
                    <Route path="enlaces" element={<LinksPage />} />
                    <Route path="visibilidad" element={<VisibilitySettingsPage />} />
                  </Routes>
                </main>
              </div>
            }
          />

          {/* Ruta del Portafolio Público (HU-06) */}
          <Route path="/portfolio/:username" element={<PortfolioPublico />} />

          {/* Ruta para manejar 404 - Página no encontrada */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
