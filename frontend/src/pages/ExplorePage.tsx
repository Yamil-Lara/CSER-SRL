import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderGit2, ChevronDown, User, MapPin, Briefcase, GraduationCap } from "lucide-react";
import api, { buildUrl } from '../utils/api';
import { PublicHeader } from '../components/layout/PublicHeader';

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
  const [selectedCategoria, setSelectedCategoria] = useState("Todas las categorías");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userFilter, setUserFilter] = useState<"todos" | "profesional" | "estudiante">("todos");

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Resetear la página a 1 cuando cambien los filtros principales
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedCategoria, userFilter]);

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
          const params: any = { search: searchQuery, page: currentPage };
          if (selectedCategoria !== "Todas las categorías" && categoryId) {
            params.categoria_id = categoryId;
          }
          if (userFilter !== "todos") {
            params.filter = userFilter; // Usar 'filter' que lee el backend en lugar de 'tipo_perfil'
          }
          const response = await api.get('/explore/projects', { params });
          if (response.data.success) {
            setProyectos(response.data.data.data);
            setTotalItems(response.data.data.total);
            setTotalPages(response.data.data.last_page);
          }
        } else {
          const params: any = { search: searchQuery, page: currentPage };
          if (userFilter !== "todos") {
            params.filter = userFilter;
          }
          const response = await api.get('/explore/users', { params });
          if (response.data.success) {
            setUsuarios(response.data.data.data);
            setTotalItems(response.data.data.total);
            setTotalPages(response.data.data.last_page);
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
  }, [activeTab, searchQuery, selectedCategoria, categorias, userFilter, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCounterText = () => {
    let suffix = activeTab === "proyectos" ? "Proyectos" : "Portafolios";
    
    if (userFilter === "profesional") suffix += " de Profesionales";
    if (userFilter === "estudiante") suffix += " de Estudiantes";
    
    if (activeTab === "proyectos" && selectedCategoria !== "Todas las categorías") {
      suffix += ` en ${selectedCategoria}`;
    }
    
    return `${totalItems} ${suffix}`;
  };


  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-900 transition-colors duration-300">
      <PublicHeader />

      <div className="max-w-6xl mx-auto pt-32 pb-8 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Explorar</h1>
          <p className="text-lg mb-8 text-slate-500 dark:text-slate-400">Descubre portafolios de profesionales y proyectos de software.</p>

          <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Busca por nombre, especialidad o categoría" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-[#3B82F6] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-600">Buscar</button>
          </div>

          <div className="flex justify-center gap-12 border-b border-slate-200 dark:border-slate-700 mb-8">
            <button onClick={() => setActiveTab("portafolios")} className={`pb-4 text-sm font-bold relative ${activeTab === "portafolios" ? "text-[#3B82F6]" : "text-slate-400 dark:text-slate-500"}`}>
              Portafolios
              {activeTab === "portafolios" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3B82F6]" />}
            </button>
            <button onClick={() => setActiveTab("proyectos")} className={`pb-4 text-sm font-bold relative ${activeTab === "proyectos" ? "text-[#3B82F6]" : "text-slate-400 dark:text-slate-500"}`}>
              Proyectos
              {activeTab === "proyectos" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3B82F6]" />}
            </button>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => setUserFilter("todos")} 
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors ${userFilter === "todos" ? "bg-[#3B82F6] text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setUserFilter("profesional")} 
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors ${userFilter === "profesional" ? "bg-[#3B82F6] text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"}`}
            >
              Profesionales
            </button>
            <button 
              onClick={() => setUserFilter("estudiante")} 
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors ${userFilter === "estudiante" ? "bg-[#3B82F6] text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"}`}
            >
              Estudiantes
            </button>
          </div>
        </div>

        <div className="pb-20">
          {activeTab === "proyectos" && (
            <div className="flex flex-col items-center">
              <div className="relative mb-10 flex flex-col items-center w-full">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Filtrar por categoría</label>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between gap-3 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 shadow-sm min-w-[260px]">
                  <div className="flex items-center gap-3">
                    <FolderGit2 size={18} className="text-[#3B82F6]" />
                    <span className="text-sm font-semibold">{selectedCategoria}</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-[85px] mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                    <button onClick={() => { setSelectedCategoria("Todas las categorías"); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                      Todas las categorías
                    </button>
                    {categorias.map((cat) => (
                      <button key={cat.id} onClick={() => { setSelectedCategoria(cat.nombre); setIsDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!loading && (
                <div className="w-full max-w-6xl mb-6 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {getCounterText()}
                  </h2>
                </div>
              )}

              {loading ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">Cargando...</div>
              ) : proyectos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                  {proyectos.map((proy) => (
                    <div
                      key={proy.id}
                      onClick={() => navigate(`/proyecto/${proy.id}`)}
                      className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                    >
                      <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400 border-b border-slate-100 dark:border-slate-600 relative overflow-hidden">
                        {proy.imagen ? (
                          <img src={buildUrl(proy.imagen)} alt={proy.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <FolderGit2 size={48} className="opacity-20 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                              {proy.categoria?.nombre === 'Otro' && proy.categoria_personalizada ? proy.categoria_personalizada : (proy.categoria?.nombre || "Sin categoría")}
                            </span>
                          </>
                        )}
                        {proy.categoria && proy.imagen && (
                          <span className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200 shadow-sm">
                            {proy.categoria.nombre === 'Otro' && proy.categoria_personalizada ? proy.categoria_personalizada : proy.categoria.nombre}
                          </span>
                        )}
                      </div>
                      <div className="p-6 text-left flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-1">{proy.titulo}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">{proy.descripcion}</p>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {Array.isArray(proy.tecnologias) 
                            ? proy.tecnologias.slice(0, 3).map((tech, i) => (
                                <span key={i} className="inline-block px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-800">{tech}</span>
                              ))
                            : proy.tecnologias && (
                                <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-800">{proy.tecnologias}</span>
                              )
                          }
                          {Array.isArray(proy.tecnologias) && proy.tecnologias.length > 3 && (
                            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-600">+{proy.tecnologias.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                          {proy.autor?.foto ? (
                            <img src={buildUrl(proy.autor.foto)} alt={proy.autor.nombre} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300">
                              <User size={14} />
                            </div>
                          )}
                          <p className="text-sm text-slate-500 dark:text-slate-400"><span className="text-slate-700 dark:text-slate-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{proy.autor?.nombre}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">No se encontraron proyectos.</div>
              )}
              
              {!loading && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === "portafolios" && (
            <div className="flex flex-col items-center">
              {!loading && (
                <div className="w-full max-w-6xl mb-6 mt-4 flex justify-between items-end">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {getCounterText()}
                  </h2>
                </div>
              )}

              {loading ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">Cargando...</div>
              ) : usuarios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
                  {usuarios.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => navigate(`/portfolio/${user.username}`)}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 mb-4 overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
                        {user.foto ? (
                          <img src={buildUrl(user.foto)} alt={user.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{user.nombre}</h3>
                      <p className="text-sm text-blue-500 font-medium mb-3">@{user.username}</p>
                      
                      <div className="flex-grow flex flex-col items-center gap-2 mb-4">
                        {(user.profesion || user.carrera) && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            {user.profesion ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                            <span className="line-clamp-1">{user.profesion || user.carrera}</span>
                          </div>
                        )}
                        {user.ubicacion && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                            <MapPin size={14} />
                            <span>{user.ubicacion}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{user.tipo_perfil}</span>
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                          <FolderGit2 size={16} className="text-blue-500" />
                          <span>{user.proyectos_count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">No se encontraron portafolios.</div>
              )}

              {!loading && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;