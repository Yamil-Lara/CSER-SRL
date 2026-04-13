// frontend/src/components/ProjectCard.tsx
import { Calendar, Tag, GitBranch, ExternalLink, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Project } from '../pages/ProjectsPage';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
}

export default function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  // Formateador de fecha seguro
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Sin fecha';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getDate() + 1}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Función para garantizar el color correcto según el estado
  const getStatusColor = (status?: string) => {
    // Convertimos a minúsculas y quitamos espacios invisibles por si acaso
    const normalizedStatus = status?.trim().toLowerCase();

    if (normalizedStatus === 'pendiente') {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
    if (normalizedStatus === 'rechazado') {
      return 'bg-red-100 text-red-800 border border-red-200';
    }
    // Por defecto (aprobado o cualquier otro)
    return 'bg-green-100 text-green-800 border border-green-200';
  };

  return (
    <div className="project-card">
      <div className="project-image-placeholder">
        <FolderOpen size={48} strokeWidth={1.5} />
      </div>
      
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        
        {/* Utilizamos clases de Tailwind para darle forma de "píldora" y aplicamos el color dinámico */}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="project-desc">{project.description}</p>

      <div className="project-meta">
        <div className="meta-item">
          <Tag size={14} />
          <span>{project.category}</span>
        </div>
        <div className="meta-item">
          <Calendar size={14} />
          <span>{formatDate(project.date)}</span>
        </div>
      </div>

      <div className="tags-container">
        {project.technologies && project.technologies.length > 0 ? (
           project.technologies.map((tech, index) => (
            <span key={index} className="tag">{tech}</span>
          ))
        ) : (
          <span className="text-xs text-gray-400">Sin tecnologías</span>
        )}
      </div>

      <div className="project-links">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" title="Ver en GitHub">
            <GitBranch size={18} />
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer" title="Ver Demo">
            <ExternalLink size={18} />
          </a>
        )}
      </div>

      <div className="project-actions">
        <button className="btn-icon-text" onClick={() => onEdit(project)}>
          <Edit size={16} />
          Editar
        </button>
        <button className="btn-icon" onClick={() => onDelete(project.id)} title="Eliminar proyecto">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}