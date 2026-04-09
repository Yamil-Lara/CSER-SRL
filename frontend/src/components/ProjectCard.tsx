import { Calendar, Tag, GitBranch, ExternalLink, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Project } from '../pages/ProjectsPage';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  // Formatear fecha si es posible para mostrar "8/4/2026"
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      // Compensa zona horaria simplificada
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
        {project.status === 'aprobado' && (
          <span className="status-badge">aprobado</span>
        )}
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
        {project.technologies.map((tech, index) => (
          <span key={index} className="tag">{tech}</span>
        ))}
      </div>

      <div className="project-links">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer">
            <GitBranch size={18} /> {/* Aquí usamos el nuevo ícono */}
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
          </a>
        )}
      </div>

      <div className="project-actions">
        <button className="btn-icon-text">
          <Edit size={16} />
          Editar
        </button>
        <button className="btn-icon" onClick={() => onDelete(project.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}