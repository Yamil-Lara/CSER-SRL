import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Sun, FolderGit2, ChevronDown } from "lucide-react";

const mockProyectos = [
  { id: 1, titulo: "ejemplo1", tecnologia: "React", autor: "Ana García", categoria: "Desarrollo Web" },
  { id: 2, titulo: "ejemplo2", tecnologia: "Flutter", autor: "Carlos Ruiz", categoria: "Mobile" }
];

const categorias = ["Todas las categorías", "Desarrollo Web", "UI/UX Design", "Aplicaciones Móviles", "Data Science"];

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"portafolios" | "proyectos">("proyectos");
  const [filter, setFilter] = useState("Todos");
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [selectedCategoria, setSelectedCategoria] = useState("Todas las categorías");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="min-h-screen bg-[#F1F5F9] transition-colors duration-300">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-slate-200">
        <div className="text-2xl font-extrabold text-[#3B82F6] cursor-pointer" onClick={() => navigate('/')}>DevFolio</div>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-[#3B82F6]">Características</a>
          <a href="#" className="text-[#3B82F6] font-semibold">Explorar</a>
          <a href="#" className="hover:text-[#3B82F6]">Cómo Funciona</a>
          <a href="#" className="hover:text-[#3B82F6]">Nosotros</a>
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-medium text-slate-700" onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">Regístrate Gratis</button>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 text-slate-600">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 text-slate-900">Explorar</h1>
          <p className="text-lg mb-8 text-slate-500">Descubre portafolios de profesionales y proyectos de software.</p>

          <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input type="text" className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Busca por nombre..." />
            </div>
            <button className="bg-[#3B82F6] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-600">Buscar</button>
          </div>

          <div className="flex justify-center gap-12 border-b border-slate-200 mb-8">
            <button onClick={() => setActiveTab("portafolios")} className={`pb-4 text-sm font-bold relative ${activeTab === "portafolios" ? "text-[#3B82F6]" : "text-slate-400"}`}>
              Portafolios
              {activeTab === "portafolios" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3B82F6]" />}
            </button>
            <button onClick={() => setActiveTab("proyectos")} className={`pb-4 text-sm font-bold relative ${activeTab === "proyectos" ? "text-[#3B82F6]" : "text-slate-400"}`}>
              Proyectos
              {activeTab === "proyectos" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3B82F6]" />}
            </button>
          </div>
        </div>

        <div className="pb-20">
          {activeTab === "proyectos" && (
            <div className="flex flex-col items-center">
              <div className="relative mb-10 flex flex-col items-center w-full">
                <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Filtrar por categoría</label>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-slate-700 shadow-sm min-w-[260px]">
                  <div className="flex items-center gap-3">
                    <FolderGit2 size={18} className="text-[#3B82F6]" />
                    <span className="text-sm font-semibold">{selectedCategoria}</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-[85px] mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                    {categorias.map((cat) => (
                      <button key={cat} onClick={() => { setSelectedCategoria(cat); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-50">
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {mockProyectos.map((proy) => (
                  <div
                    key={proy.id}
                    onClick={() => navigate(`/proyecto/${proy.id}`)}
                    className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="aspect-[16/10] bg-[#F8FAFC] flex flex-col items-center justify-center text-[#3B82F6]/30 border-b border-slate-100">
                      <FolderGit2 size={48} className="opacity-20 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{proy.categoria}</span>
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{proy.titulo}</h3>
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">{proy.tecnologia}</span>
                      </div>
                      <p className="text-sm text-slate-500">por <span className="text-[#3B82F6] font-medium">{proy.autor}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;