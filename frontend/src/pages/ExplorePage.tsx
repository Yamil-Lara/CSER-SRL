import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Sun, FolderGit2, ChevronDown, User, MapPin, Briefcase, GraduationCap } from "lucide-react";
import api from "../utils/api";

interface Categoria {
  id: number;
  nombre: string;
  icono?: string;
  color?: string;
}

interface Autor {
  id: number;
  nombre: string;
  username: string;
  foto?: string | null;
}

interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  tecnologias: string[] | string | null;
  imagen: string | null;
  categoria: Categoria | null;
  autor: Autor | null;
}

interface Usuario {
  id: number;
  nombre: string;
  username: string;
  foto: string | null;
  profesion: string | null;
  especialidad: string | null;
  ubicacion: string | null;
  universidad: string | null;
  carrera: string | null;
  proyectos_count: number;
  tipo_perfil: string;
}

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"portafolios" | "proyectos">("proyectos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [selectedCategoria, setSelectedCategoria] = useState("Todas las categorías");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/categorias');
        if (res.data.success) {
          setCategorias(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "proyectos") {
          const categoryId = categorias.find(c => c.nombre === selectedCategoria)?.id;
          const params: any = { search: searchQuery };
          if (selectedCategoria !== "Todas las categorías" && categoryId) {
            params.categoria_id = categoryId;
          }
          const response = await api.get('/explore/projects', { params });
          if (response.data.success) {
            setProyectos(response.data.data.data);
          }
        } else {
          const response = await api.get('/explore/users', { params: { search: searchQuery } });
          if (response.data.success) {
            setUsuarios(response.data.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timeoutId);
  }, [activeTab, searchQuery, selectedCategoria, categorias]);

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

  const buildUrl = (path: string | null | undefined): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage')) return `http://localhost:8000${path}`;
    if (path.startsWith('storage')) return `http://localhost:8000/${path}`;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `http://localhost:8000/storage/${cleanPath}`;
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
              <input 
                type="text" 
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Busca por nombre..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    <button onClick={() => { setSelectedCategoria("Todas las categorías"); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-50">
                      Todas las categorías
                    </button>
                    {categorias.map((cat) => (
                      <button key={cat.id} onClick={() => { setSelectedCategoria(cat.nombre); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-50">
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-10 text-slate-500">Cargando...</div>
              ) : proyectos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                  {proyectos.map((proy) => (
                    <div
                      key={proy.id}
                      onClick={() => navigate(`/proyecto/${proy.id}`)}
                      className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                    >
                      <div className="aspect-[16/10] bg-slate-100 flex flex-col items-center justify-center text-slate-400 border-b border-slate-100 relative overflow-hidden">
                        {proy.imagen ? (
                          <img src={buildUrl(proy.imagen)} alt={proy.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <FolderGit2 size={48} className="opacity-20 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{proy.categoria?.nombre || "Sin categoría"}</span>
                          </>
                        )}
                        {proy.categoria && proy.imagen && (
                          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-700 shadow-sm">
                            {proy.categoria.nombre}
                          </span>
                        )}
                      </div>
                      <div className="p-6 text-left flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{proy.titulo}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{proy.descripcion}</p>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {Array.isArray(proy.tecnologias) 
                            ? proy.tecnologias.slice(0, 3).map((tech, i) => (
                                <span key={i} className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">{tech}</span>
                              ))
                            : proy.tecnologias && (
                                <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">{proy.tecnologias}</span>
                              )
                          }
                          {Array.isArray(proy.tecnologias) && proy.tecnologias.length > 3 && (
                            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-semibold border border-slate-200">+{proy.tecnologias.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                          {proy.autor?.foto ? (
                            <img src={buildUrl(proy.autor.foto)} alt={proy.autor.nombre} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <User size={14} />
                            </div>
                          )}
                          <p className="text-sm text-slate-500"><span className="text-slate-700 font-medium hover:text-blue-600 transition-colors">{proy.autor?.nombre}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">No se encontraron proyectos.</div>
              )}
            </div>
          )}
          {activeTab === "portafolios" && (
            <div className="flex flex-col items-center">
              {loading ? (
                <div className="text-center py-10 text-slate-500">Cargando...</div>
              ) : usuarios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
                  {usuarios.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => navigate(`/portfolio/${user.username}`)}
                      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden border-4 border-white shadow-md">
                        {user.foto ? (
                          <img src={buildUrl(user.foto)} alt={user.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{user.nombre}</h3>
                      <p className="text-sm text-blue-500 font-medium mb-3">@{user.username}</p>
                      
                      <div className="flex-grow flex flex-col items-center gap-2 mb-4">
                        {(user.profesion || user.carrera) && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            {user.profesion ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                            <span className="line-clamp-1">{user.profesion || user.carrera}</span>
                          </div>
                        )}
                        {user.ubicacion && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin size={14} />
                            <span>{user.ubicacion}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{user.tipo_perfil}</span>
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                          <FolderGit2 size={16} className="text-blue-500" />
                          <span>{user.proyectos_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">No se encontraron portafolios.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;