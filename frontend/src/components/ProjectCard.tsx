import { Calendar, Tag, GitBranch, ExternalLink, Edit, Trash2, FolderOpen, MessageSquare } from 'lucide-react';
import { Project } from '../pages/ProjectsPage';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
  onManageComments: (project: Project) => void; // NUEVA PROP: Para abrir el gestor de comentarios
}

export default function ProjectCard({ project, onDelete, onEdit, onManageComments }: ProjectCardProps) {
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

  const getStatusColor = (status?: string) => {
    const normalizedStatus = status?.trim().toLowerCase();
    if (normalizedStatus === 'pendiente') {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
    if (normalizedStatus === 'rechazado') {
      return 'bg-red-100 text-red-800 border border-red-200';
    }
    return 'bg-green-100 text-green-800 border border-green-200';
  };

  return (
    <div className="project-card">
      <div className="project-image-placeholder">
        <FolderOpen size={48} strokeWidth={1.5} />
      </div>
      
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
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

      {/* ACTUALIZACIÓN: Sección de acciones con el nuevo botón */}
      <div className="project-actions flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
        <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex-1 justify-center" 
            onClick={() => onManageComments(project)}
        >
          <MessageSquare size={16} />
          Comentarios
        </button>
        <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" 
            onClick={() => onEdit(project)}
        >
          <Edit size={16} />
          Editar
        </button>
        <button 
            className="flex items-center justify-center p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" 
            onClick={() => onDelete(project.id)} 
            title="Eliminar proyecto"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}