import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import EmptyState from '../components/EmptyState';
import ProjectModal from '../components/ProjectModal';
import ProjectCard from '../components/ProjectCard';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  technologies: string[];
  tools?: string;
  client?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: string;
}

// Configuración de Axios para conectarse a Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ajusta al puerto donde corre php artisan serve
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar proyectos al montar la página
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      // El endpoint GET /proyectos es público según api.php
      const response = await api.get('/proyectos');
      
      // Asumiendo que ApiResponseTrait retorna { data: [...], message: "..." }
      const projectsData = response.data.data || response.data;

      // Mapeo de la BD (Laravel) a la Interfaz (React)
      const formattedProjects: Project[] = projectsData.map((item: any) => ({
        id: item.id.toString(),
        title: item.titulo,
        description: item.descripcion,
        category: item.categoria?.nombre || 'Sin categoría',
        date: item.fecha_proyecto || item.created_at,
        // Si tecnologías es un texto separado por comas en la BD, lo convertimos a array
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

  const handleAddProject = async (newProjectData: any) => {
    try {
      // POST requiere autenticación (Sanctum)
      // Asegúrate de enviar el Bearer Token en el header si el usuario está logueado
      await api.post('/proyectos', newProjectData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // O donde guardes el token
        }
      });
      
      setIsModalOpen(false);
      fetchProjects(); // Recargar la lista desde la BD
    } catch (error) {
      console.error('Error al crear proyecto:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      // DELETE también requiere autenticación
      await api.delete(`/proyectos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Mis Proyectos</h1>
          <p className="page-subtitle">Gestiona tu portafolio de proyectos de software</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Nuevo Proyecto
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Cargando tus proyectos...
        </div>
      ) : projects.length === 0 ? (
        <EmptyState onOpenModal={() => setIsModalOpen(true)} />
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
             <ProjectCard 
               key={project.id} 
               project={project} 
               onDelete={handleDeleteProject}
             />
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddProject} 
        />
      )}
    </div>
  );
}