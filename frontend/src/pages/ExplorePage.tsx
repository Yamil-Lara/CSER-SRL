import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, LayoutDashboard, LogOut, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function ExplorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Header Recreado */}
      <header className="card border-b z-10 relative">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl text-primary flex items-center justify-center">
              <Code2 size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-main)' }}>DevFolio</span>
          </div>

          {/* Nav Central */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-muted hover:text-primary transition-colors cursor-pointer">Inicio</Link>
            <span className="font-semibold cursor-pointer border-b-2 border-primary py-1" style={{ color: 'var(--text-main)' }}>Explorar</span>
            <Link to={`/portfolio/${localStorage.getItem('username') || ''}`} className="text-muted hover:text-primary transition-colors cursor-pointer">Mi Portafolio</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard/perfil')} 
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted hover:bg-black/5 hover:text-primary px-3 py-2 rounded-md transition-colors cursor-pointer dark:hover:bg-white/10"
            >
              <LayoutDashboard size={18} />
              <span>Mi Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-sm font-medium text-muted hover:bg-destructive/10 hover:text-destructive px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main UI */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>Explorar</h1>
          <p className="text-muted">Descubre portafolios de profesionales y proyectos de software.</p>
        </div>

        {/* Search Layout */}
        <div className="flex justify-center mb-6">
          <div className="card flex w-full max-w-2xl items-center border rounded-lg overflow-hidden shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
            <div className="pl-4 text-muted">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Busca por nombre, especialidad o categoría" 
              className="flex-1 px-3 py-3 outline-none text-sm bg-transparent"
              style={{ color: 'var(--text-main)' }}
            />
            <div className="pr-1 py-1">
              <button className="bg-primary text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-10 text-sm">
          <button className="bg-primary text-white px-5 py-2.5 rounded-full font-medium shadow-sm transition-colors">Todos</button>
          <button className="card text-muted border px-5 py-2.5 rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Profesionales</button>
          <button className="card text-muted border px-5 py-2.5 rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Estudiantes</button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 border-b mb-10" style={{ borderColor: 'var(--border-color)' }}>
          <button className="text-primary font-medium border-b-2 border-primary px-2 py-3">Portafolios</button>
          <button className="text-muted font-medium px-2 py-3 hover:text-primary transition-colors">Proyectos</button>
        </div>

        {/* Grid Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mockup Card: Ana García */}
          <Card className="card flex flex-col items-center p-8 text-center hover:shadow-md transition-shadow cursor-pointer rounded-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
              AG
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-main)' }}>Ana García</h3>
            <p className="text-primary text-sm mb-2 font-medium">Desarrolladora Full Stack</p>
            <p className="text-xs text-muted">La Paz, Bolivia</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
