import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Sun } from "lucide-react";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"portafolios" | "proyectos">("portafolios");
  const [filter, setFilter] = useState("Todos");

  // Asumimos que manejas el estado de dark mode globalmente, 
  // pero aquí usamos clases que responden al selector .dark de tu index.css
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.removeAttribute('data-theme');
      localStorage.setItem('devfolio-theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('devfolio-theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--bg-color)]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-[var(--card)] shadow-sm border-b border-[var(--border-color)]">
        <div className="text-2xl font-extrabold text-[var(--primary)] cursor-pointer" onClick={() => navigate('/')}>
          DevFolio
        </div>

        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-[var(--text-muted)]">
          <a href="#" className="hover:text-[var(--primary)] transition-colors">Características</a>
          <a href="#" className="text-[var(--primary)] font-semibold">Explorar</a>
          <a href="#" className="hover:text-[var(--primary)] transition-colors">Cómo Funciona</a>
          <a href="#" className="hover:text-[var(--primary)] transition-colors">Nosotros</a>
        </div>

        <div className="flex gap-4 items-center">
          <button className="text-sm font-medium text-[var(--text-main)]" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Regístrate Gratis
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--muted)] text-[var(--text-main)] hover:scale-105 transition-transform"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto text-center mt-16 px-4">
        <h1 className="text-4xl font-extrabold mb-4 text-[var(--text-main)]">
          Explorar
        </h1>
        <p className="text-lg mb-8 text-[var(--text-muted)]">
          Descubre portafolios de profesionales y proyectos de software.
        </p>

        {/* BUSCADOR */}
        <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">
          <div className="relative flex-grow max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[var(--text-muted)]" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm"
              placeholder="Busca por nombre, especialidad o categoría"
            />
          </div>
          <button className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-all">
            Buscar
          </button>
        </div>

        {/* FILTROS (Pills) */}
        <div className="flex justify-center gap-4 mb-12">
          {["Todos", "Profesionales", "Estudiantes"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all shadow-sm border ${filter === item
                  ? "bg-[var(--primary)] text-white border-transparent"
                  : "bg-[var(--card)] text-[var(--text-main)] border-[var(--border-color)] hover:bg-[var(--muted)]"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-12 border-b border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab("portafolios")}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === "portafolios" ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
          >
            Portafolios
            {activeTab === "portafolios" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("proyectos")}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === "proyectos" ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
          >
            Proyectos
            {activeTab === "proyectos" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)]" />
            )}
          </button>
        </div>

        {/* RESULTADOS */}
        <div className="py-12 text-[var(--text-muted)]">
          {activeTab === "portafolios" ? "No se encontraron portafolios" : "No se encontraron proyectos"}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;