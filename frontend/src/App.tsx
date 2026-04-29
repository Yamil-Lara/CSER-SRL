// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExperiencePage } from "./pages/ExperiencePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminAprobacionesPage from "./pages/AdminAprobacionesPage";
//import Sidebar from "./components/Sidebar";





import { Sidebar } from "./components/layout/Sidebar";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import UserProfile from "./components/UserProfile";
import { LandingPage } from "./pages/LandingPage"; 
import PortfolioPublico from "./pages/PortfolioPublico";
import LinksPage from "./pages/LinksPage"; 
import { VisibilitySettingsPage } from "./pages/VisibilitySettingsPage";
import ExplorePage from "./pages/ExplorePage";
import PublicProjectDetail from './pages/PublicProjectDetail';
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AdminCommentPage from "./pages/AdminCommentPage";
import LoginPage from "./pages/LoginPage";

// Componentes temporales para las rutas de admin que faltan
const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-sidebar">Panel de Administrador</h1>
    <p className="text-sidebar/70 mt-2">Bienvenido al panel de control</p>
  </div>
);

const AdminReportes = () => (
  <div>
    <h1 className="text-2xl font-bold text-sidebar">Reportes PDF</h1>
    <p className="text-sidebar/70 mt-2">Genera reportes del sistema</p>
  </div>
);

function App(): JSX.Element {
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

    const savedTheme = localStorage.getItem('devfolio-theme');

    if (savedTheme) {
      applyTheme(savedTheme === 'dark');
    } else {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(darkModeQuery.matches);
    }

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
          {/* Ruta principal */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rutas públicas */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/proyecto/:id" element={<ProjectDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ============================================================ */}
          {/* RUTAS DE ADMINISTRADOR */}
          {/* ============================================================ */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                  <main className="main-content">
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="usuarios" element={<AdminUsersPage />} />
                      <Route path="aprobaciones" element={<AdminAprobacionesPage />} />
                      <Route path="moderacion" element={<AdminCommentPage />} />
                      <Route path="reportes" element={<AdminReportes />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          {/* ============================================================ */}
          {/* RUTAS DE USUARIO NORMAL */}
          {/* ============================================================ */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
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
                      <Route path="moderacion" element={<AdminCommentPage />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Ruta del Portafolio Público */}
          <Route path="/portfolio/:username" element={<PortfolioPublico />} />
          <Route path="/portfolio/:username/proyecto/:projectId" element={<PublicProjectDetail />} />

          {/* Ruta 404 */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;