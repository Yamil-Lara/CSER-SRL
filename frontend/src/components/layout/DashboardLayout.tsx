import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Estados iniciales
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // EFECTO PARA DETECTAR EL TAMAÑO DE PANTALLA
  useEffect(() => {
    const handleResize = () => {
      // Si el ancho de la pantalla es menor a 768px (celulares/tablets pequeñas)
      if (window.innerWidth < 768) {
        setIsCollapsed(true);       // Colapsa el Sidebar (solo íconos)
        setIsMobileMenuOpen(false); // Asegura que esté oculto el panel lateral
      } else {
        setIsCollapsed(false);      // En pantallas grandes lo muestra expandido
      }
    };

    // 1. Ejecutar la validación al cargar la página por primera vez
    handleResize();

    // 2. (Opcional) Escuchar si el usuario voltea el celular o redimensiona la ventana
    window.addEventListener('resize', handleResize);
    
    // Limpiar el event listener cuando se desmonte el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-background relative flex">
      {/* Botón flotante para abrir el menú en móviles */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Contenedor del Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      {/* Overlay oscuro: Al hacer clic fuera del sidebar en móvil, se cierra */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1 min-h-screen w-full transition-all duration-300 overflow-x-hidden">
        <div className="py-6 px-4 md:py-8 md:px-8 mt-12 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}