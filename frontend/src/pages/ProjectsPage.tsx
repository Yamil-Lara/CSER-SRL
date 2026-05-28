import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ProjectModal from '../components/ProjectModal';
import ProjectCard from '../components/ProjectCard';
import ProjectCommentsManager from '../components/ProjectCommentsManager';
import api from '../utils/api'; 

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  date: string;
  technologies: string[];
  tools?: string;
  client?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: string;
  image?: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [commentsProject, setCommentsProject] = useState<Project | null>(null);

  const location = useLocation();
  const editModalHandled = useRef(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setEditingProject(null);
      setIsModalOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (editModalHandled.current) return;
    if (location.state?.openEditModal && location.state?.editProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === String(location.state.editProjectId));
      if (project) {
        editModalHandled.current = true;
        setEditingProject(project);
        setIsModalOpen(true);
      }
    }
  }, [projects]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/proyectos');
      const projectsData = response.data.data || response.data;

      const formattedProjects: Project[] = projectsData.map((item: any) => ({
        id: item.id.toString(),
        title: item.titulo,
        description: item.descripcion,
        category: item.categoria?.nombre || 'Sin categoría',
        categoryId: item.categoria_id?.toString(),
        date: item.fecha_proyecto || item.created_at,
        technologies: typeof item.tecnologias === 'string' 
            ? item.tecnologias.split(',').map((t: string) => t.trim()) 
            : (item.tecnologias || []),
        tools: item.herramientas,
        client: item.cliente,
        githubUrl: item.github,
        demoUrl: item.demo,
        status: item.estado,
        image: item.imagen || null
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async (projectData: FormData) => {
    try {
      if (editingProject) {
        // Para edición, usar POST con _method PUT
        await api.post(`/proyectos/${editingProject.id}`, projectData);
      } else {
        await api.post('/proyectos', projectData);
      }
      closeModal();
      fetchProjects();
    } catch (error: any) {
      console.error('Error completo:', error);
      let errorMsg = "Ocurrió un error desconocido.";
      
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        errorMsg = Array.isArray(firstError) ? firstError[0] : "Revisa los campos del formulario";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      alert("Error al guardar: " + errorMsg);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
    
    try {
      await api.delete(`/proyectos/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error: any) {
      alert("Error al eliminar: " + (error.response?.data?.message || error.message));
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const openCommentsManager = (project: Project) => {
    setCommentsProject(project);
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Mis Proyectos</h1>
          <p className="page-subtitle">Gestiona tu portafolio de proyectos de software</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm" 
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
        >
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
          Cargando Proyectos...
        </div>
      ) : projects.length === 0 ? (
        <EmptyState onOpenModal={() => { setEditingProject(null); setIsModalOpen(true); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
             <ProjectCard 
               key={project.id} 
               project={project} 
               onDelete={handleDeleteProject}
               onEdit={openEditModal} 
               onManageComments={openCommentsManager}
             />
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar Proyecto */}
      {isModalOpen && (
        <ProjectModal 
          onClose={closeModal} 
          onSave={handleSaveProject}
          projectToEdit={editingProject} 
        />
      )}

      {/* Modal para el Gestor de Comentarios */}
      {commentsProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Comentarios del Proyecto</h2>
                <p className="text-sm text-slate-500 font-medium">{commentsProject.title}</p>
              </div>
              <button 
                onClick={() => setCommentsProject(null)} 
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Cuerpo del Modal */}
            <div className="overflow-y-auto p-6 bg-slate-50 flex-1">
              <ProjectCommentsManager proyectoId={commentsProject.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}