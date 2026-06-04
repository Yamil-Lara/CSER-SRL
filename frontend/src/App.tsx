// src/App.tsx
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExperiencePage } from "./pages/ExperiencePage";
import { ExperienceLaboralPage } from "./pages/ExperienceLaboralPage";
import { FormacionAcademicaPage } from "./pages/FormacionAcademicaPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminAprobacionesPage from "./pages/AdminAprobacionesPage";
import AdminBackupsPage from "./pages/AdminBackupsPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminReportesPage from "./pages/AdminReportesPage";
import PublicExperiencePage from './pages/PublicExperiencePage';
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
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UserOffersPage } from "./pages/UserOffersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
      <Toaster position="top-right" />
      <AuthProvider>
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rutas públicas */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/proyecto/:id" element={<ProjectDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* RUTAS DEL PORTAFOLIO PÚBLICO */}
          <Route path="/portfolio/:username" element={<PortfolioPublico />} />
          <Route path="/portfolio/:username/proyecto/:projectId" element={<PublicProjectDetail />} />
          {/* NUEVA RUTA AQUÍ */}
          <Route path="/portfolio/:username/experiencia" element={<PublicExperiencePage />} />

          {/* ============================================================ */}
          {/* RUTAS DE ADMINISTRADOR */}
          {/* ============================================================ */}
          <Route
            path="/gestion/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                  <main className="main-content">
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboardPage />} />
                      <Route path="usuarios" element={<AdminUsersPage />} />
                      <Route path="aprobaciones" element={<AdminAprobacionesPage />} />
                      <Route path="moderacion" element={<AdminCommentPage />} />                      
                      <Route path="backups" element={<AdminBackupsPage />} />
                      <Route path="logs" element={<AdminLogsPage />} />
                      <Route path="reportes" element={<AdminReportesPage />} />
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
                      <Route index element={<DashboardPage />} />
                      <Route path="perfil" element={<UserProfile />} />
                      <Route path="reclutadores" element={<UserOffersPage />} />
                      <Route path="proyectos" element={<ProjectsPage />} />
                      <Route path="habilidades" element={<SkillsPage />} />                  
                      <Route path="experiencia" element={<Navigate to="/dashboard/experiencia-laboral" replace />} />
                      <Route path="experiencia-laboral" element={<ExperienceLaboralPage />} />
                      <Route path="formacion-academica" element={<FormacionAcademicaPage />} />
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