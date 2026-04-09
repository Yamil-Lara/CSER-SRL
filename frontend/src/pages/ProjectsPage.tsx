import { useState } from 'react';
import { Plus } from 'lucide-react';
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
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

      {projects.length === 0 ? (
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