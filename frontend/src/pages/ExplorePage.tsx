import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Sun } from "lucide-react";
import { useExplore } from "../hooks/useExplore";
import api from "../utils/api";

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"portafolios" | "proyectos">("portafolios");
  const [filter, setFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { users, projects, loading, error, usersPagination, projectsPagination, searchUsers, searchProjects, handleUsersPageChange, handleProjectsPageChange } = useExplore();

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

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categorias');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (activeTab === "portafolios") {
      const filterValue = filter === "Todos" ? undefined : filter.toLowerCase();
      searchUsers({ search: searchTerm, filter: filterValue });
    } else {
      searchProjects({ categoria_id: selectedCategory || undefined, page: 1, per_page: 12 });
    }
  }, [activeTab, filter, selectedCategory]);

  // Manejar búsqueda
  const handleSearch = () => {
    if (activeTab === "portafolios") {
      const filterValue = filter === "Todos" ? undefined : filter.toLowerCase();
      searchUsers({ search: searchTerm, filter: filterValue });
    } else {
      searchProjects({ categoria_id: selectedCategory || undefined, page: 1, per_page: 12 });
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-all">
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

        {/* FILTRO DE CATEGORÍA PARA PROYECTOS */}
        {activeTab === "proyectos" && (
          <div className="flex justify-center gap-4 mb-8">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border border-[var(--border-color)] rounded-xl bg-[var(--card)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {/* RESULTADOS */}
        <div className="py-12">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : activeTab === "portafolios" ? (
            users.length === 0 ? (
              <div className="text-center text-[var(--text-muted)]">No se encontraron portafolios</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <div key={user.id} className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-color)] hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      {user.foto ? (
                        <img src={user.foto} alt={user.nombre} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--text-muted)]">
                          {user.nombre.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-[var(--text-main)]">{user.nombre}</h3>
                        <p className="text-sm text-[var(--text-muted)]">@{user.username}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-2">{user.profesion || user.especialidad || 'Sin profesión'}</p>
                    <p className="text-sm text-[var(--text-muted)] mb-4">{user.ubicacion || ''}</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <span>{user.proyectos_count} proyectos</span>
                      <span>•</span>
                      <span className="capitalize">{user.tipo_perfil}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            projects.length === 0 ? (
              <div className="text-center text-[var(--text-muted)]">No se encontraron proyectos</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-[var(--card)] rounded-xl overflow-hidden shadow-sm border border-[var(--border-color)] hover:shadow-md transition-shadow">
                    {project.imagen && (
                      <img src={project.imagen} alt={project.titulo} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        {project.categoria && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: project.categoria.color + '20', color: project.categoria.color }}>
                            {project.categoria.nombre}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[var(--text-main)] mb-2">{project.titulo}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{project.descripcion}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tecnologias.split(',').slice(0, 3).map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-[var(--muted)] rounded-full text-xs text-[var(--text-muted)]">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.autor?.foto ? (
                          <img src={project.autor.foto} alt={project.autor.nombre} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-xs text-[var(--text-muted)]">
                            {project.autor?.nombre.charAt(0) || '?'}
                          </div>
                        )}
                        <span className="text-sm text-[var(--text-muted)]">{project.autor?.nombre || 'Autor desconocido'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* PAGINACIÓN */}
        {!loading && !error && (
          <div className="flex justify-center items-center gap-4 mt-8">
            {activeTab === "portafolios" ? (
              <>
                <button
                  onClick={() => handleUsersPageChange(usersPagination.current_page - 1)}
                  disabled={usersPagination.current_page === 1}
                  className="px-4 py-2 bg-[var(--card)] text-[var(--text-main)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)]"
                >
                  Anterior
                </button>
                <span className="text-[var(--text-muted)]">
                  Página {usersPagination.current_page} de {usersPagination.last_page} ({usersPagination.total} resultados)
                </span>
                <button
                  onClick={() => handleUsersPageChange(usersPagination.current_page + 1)}
                  disabled={usersPagination.current_page === usersPagination.last_page}
                  className="px-4 py-2 bg-[var(--card)] text-[var(--text-main)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)]"
                >
                  Siguiente
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleProjectsPageChange(projectsPagination.current_page - 1)}
                  disabled={projectsPagination.current_page === 1}
                  className="px-4 py-2 bg-[var(--card)] text-[var(--text-main)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)]"
                >
                  Anterior
                </button>
                <span className="text-[var(--text-muted)]">
                  Página {projectsPagination.current_page} de {projectsPagination.last_page} ({projectsPagination.total} resultados)
                </span>
                <button
                  onClick={() => handleProjectsPageChange(projectsPagination.current_page + 1)}
                  disabled={projectsPagination.current_page === projectsPagination.last_page}
                  className="px-4 py-2 bg-[var(--card)] text-[var(--text-main)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--border-color)]"
                >
                  Siguiente
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;