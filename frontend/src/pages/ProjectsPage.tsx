import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ProjectModal from '../components/ProjectModal';
import ProjectCard from '../components/ProjectCard';
import api from '../utils/api'; // Usamos tu instancia configurada de axios

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para saber qué proyecto estamos editando
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
        status: item.estado
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      if (editingProject) {
        // ACTUALIZAR (PUT)
        await api.put(`/proyectos/${editingProject.id}`, projectData);
      } else {
        // CREAR (POST)
        await api.post('/proyectos', projectData);
      }
      
      // Si todo sale bien, cerramos el modal y recargamos
      closeModal();
      fetchProjects();
      
    } catch (error: any) {
      console.error('Error completo:', error);
      
      // Extraemos el error de Laravel para mostrarlo en pantalla
      let errorMsg = "Ocurrió un error desconocido.";
      if (error.response && error.response.data) {
        // Si Laravel envía errores de validación (422)
        if (error.response.data.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          errorMsg = Array.isArray(firstError) ? firstError[0] : "Revisa los campos del formulario";
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }
      // Mostramos una alerta en pantalla para saber qué falló
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
        <button className="btn-primary" onClick={() => { setEditingProject(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Cargando Proyectos...
        </div>
      ) : projects.length === 0 ? (
        <EmptyState onOpenModal={() => { setEditingProject(null); setIsModalOpen(true); }} />
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
             <ProjectCard 
               key={project.id} 
               project={project} 
               onDelete={handleDeleteProject}
               onEdit={openEditModal} // Conectamos el botón de editar
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