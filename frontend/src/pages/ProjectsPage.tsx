import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ProjectModal from '../components/ProjectModal';
import ProjectCard from '../components/ProjectCard';
import api from '../utils/api'; 

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  categoria_personalizada?: string | null;
  date: string;
  technologies: string[];
  tools?: string;
  client?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: string;
  image?: string | null;
  comentariosNuevos?: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
        categoria_personalizada: item.categoria_personalizada || null,
        date: item.fecha_proyecto || item.created_at,
        technologies: typeof item.tecnologias === 'string' 
            ? item.tecnologias.split(',').map((t: string) => t.trim()) 
            : (item.tecnologias || []),
        tools: item.herramientas,
        client: item.cliente,
        githubUrl: item.github,
        demoUrl: item.demo,
        status: item.estado,
        image: item.imagen || null,
        comentariosNuevos: item.comentarios_nuevos || 0
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
             />
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal 
          onClose={closeModal} 
          onSave={handleSaveProject}
          projectToEdit={editingProject} 
        />
      )}

    </div>
  );
}