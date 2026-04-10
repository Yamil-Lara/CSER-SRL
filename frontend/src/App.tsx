import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExperiencePage } from "./pages/ExperiencePage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Redirección */}
          <Route path="/" element={<Navigate to="/dashboard/experiencia" />} />

          {/* Seguridad por si algo manda a login */}
          <Route path="/login" element={<Navigate to="/dashboard/experiencia" />} />

          {/* Ruta principal */}
          <Route
            path="/dashboard/experiencia"
            element={<ExperiencePage />}
          />
          

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}