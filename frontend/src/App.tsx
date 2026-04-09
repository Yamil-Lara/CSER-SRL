import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExperiencePage } from "./pages/ExperiencePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* 🔥 REDIRECCIÓN */}
          <Route path="/" element={<Navigate to="/dashboard/experiencia" />} />

          {/* TU RUTA */}
          <Route
            path="/dashboard/experiencia"
            element={
                <ExperiencePage />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}