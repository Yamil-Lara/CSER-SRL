import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExperiencePage } from "./pages/ExperiencePage";
import Sidebar from "./components/Sidebar";
import ProjectsPage from "./pages/ProjectsPage";
import Profile from "./pages/Profile";
import UserProfile from "./components/UserProfile";

const App = (): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard/experiencia" />} />

          {/* Rutas públicas (Login, Registro, etc.) */}
          <Route path="/login" element={<Navigate to="/dashboard/experiencia" />} />

          {/* Rutas Privadas / Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                <main className="main-content">
                  <Routes>
                    <Route path="experiencia" element={<ExperiencePage />} />
                    <Route path="proyectos" element={<ProjectsPage />} />
                    <Route path="habilidades" element={<Profile />} />
                    <Route path="perfil" element={<UserProfile />} />
                  </Routes>
                </main>
              </div>
            }
          />

          {/* Ruta para manejar 404 - Página no encontrada */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
