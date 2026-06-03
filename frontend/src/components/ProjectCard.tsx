import { Calendar, Tag, GitBranch, ExternalLink, Edit, Trash2, FolderOpen, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Project } from '../pages/ProjectsPage';
import { useNavigate, useParams } from 'react-router-dom';
import { buildUrl } from '../utils/api';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
  onManageComments: (project: Project) => void;
}

export default function ProjectCard({ project, onDelete, onEdit, onManageComments }: ProjectCardProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  const handleClick = () => {
    navigate(`/portfolio/${username}/proyecto/${project.id}`);
  };

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
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
    }
    if (normalizedStatus === 'rechazado') {
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800';
    }
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800';
  };

  const imageUrl = project.image ? buildUrl(project.image) : null;

  return (
    <div className="project-card bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.image-placeholder')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`image-placeholder absolute inset-0 flex flex-col items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
          <ImageIcon size={40} strokeWidth={1.5} className="text-slate-300 dark:text-slate-600" />
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">Sin imagen</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="project-header flex justify-between items-start mb-2">
          <h3 className="project-title text-lg font-bold text-slate-800 dark:text-white">{project.title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <p className="project-desc text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{project.description}</p>

        <div className="project-meta flex gap-4 mb-3">
          <div className="meta-item flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Tag size={14} />
            <span>{project.category}</span>
          </div>
          <div className="meta-item flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={14} />
            <span>{formatDate(project.date)}</span>
          </div>
        </div>

        <div className="tags-container flex flex-wrap gap-1 mb-3">
          {project.technologies && project.technologies.length > 0 ? (
            project.technologies.slice(0, 3).map((tech, index) => (
              <span key={index} className="tag text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">{tech}</span>
            ))
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Sin tecnologías</span>
          )}
          {project.technologies && project.technologies.length > 3 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">+{project.technologies.length - 3}</span>
          )}
        </div>

        <div className="project-links flex gap-3 mb-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" title="Ver en GitHub">
              <GitBranch size={18} />
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" title="Ver Demo">
              <ExternalLink size={18} />
            </a>
          )}
        </div>

        <div className="project-actions flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex-1 justify-center" 
            onClick={() => onManageComments(project)}
          >
            <MessageSquare size={16} />
            Comentarios
          </button>
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" 
            onClick={() => onEdit(project)}
          >
            <Edit size={16} />
            Editar
          </button>
          <button 
            className="flex items-center justify-center p-1.5 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors" 
            onClick={() => onDelete(project.id)} 
            title="Eliminar proyecto"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}