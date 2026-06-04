import React, { useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Función centralizada para verificar si hay sesión activa
  const checkSession = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No hay sesión activa → forzar recarga completa para redirigir al login
      window.location.replace('/login');
    }
  }, []);

  useEffect(() => {
    // 1. Protección contra bfcache (Back-Forward Cache)
    //    Se dispara cuando el navegador restaura una página cacheada al presionar "Atrás"
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkSession();
      }
    };

    // 2. Protección contra visibilidad de pestaña
    //    Se dispara cuando el usuario regresa a la pestaña (común en Chrome al presionar "Atrás")
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    // 3. Protección contra navegación por historial (botón Atrás/Adelante)
    //    Se dispara cuando el usuario navega en el historial del navegador
    const handlePopState = () => {
      checkSession();
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [checkSession]);

  // Esperar a que termine de validar el token antes de redirigir
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // CRITERIO 3: Redirigir al login si no está autenticado y proteger vistas con el botón "Atrás"
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // CRITERIO 4: Redirigir al dashboard normal si un usuario intenta entrar al panel admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}