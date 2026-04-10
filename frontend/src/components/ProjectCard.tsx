import { Calendar, Tag, GitBranch, ExternalLink, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Project } from '../pages/ProjectsPage';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  // onEdit: (project: Project) => void; // Puedes agregarlo en el futuro
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  // Formateador de fecha seguro
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Sin fecha';
    try {
      const d = new Date(dateStr);
      // Validar que la fecha sea válida antes de retornarla
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getDate() + 1}/${d.getMonth() + 1}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="project-card">
      <div className="project-image-placeholder">
        <FolderOpen size={48} strokeWidth={1.5} />
      </div>
      
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        {/* Usamos el status directamente de la BD */}
        <span className={`status-badge ${project.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : ''}`}>
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
        {/* Validación segura por si technologies viene vacío */}
        {project.technologies && project.technologies.length > 0 ? (
           project.technologies.map((tech, index) => (
            <span key={index} className="tag">{tech}</span>
          ))
        ) : (
          <span className="text-xs text-gray-400">Sin tecnologías</span>
        )}
      </div>

      <div className="project-links">
        {/* Renderizado condicional seguro de URLs */}
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
        <button className="btn-icon-text">
          <Edit size={16} />
          Editar
        </button>
        {/* El botón de eliminar ya está conectado a la función principal */}
        <button className="btn-icon" onClick={() => onDelete(project.id)} title="Eliminar proyecto">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}