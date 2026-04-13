import { FolderPlus, Plus } from 'lucide-react';

interface EmptyStateProps {
  onOpenModal: () => void;
}

export default function EmptyState({ onOpenModal }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FolderPlus size={32} />
      </div>
      <h3 className="empty-title">No tienes proyectos aún</h3>
      <p className="empty-text">
        Comienza agregando tu primer proyecto para mostrar tu trabajo
      </p>
      <button className="btn-primary" onClick={onOpenModal}>
        <Plus size={18} />
        Crear Primer Proyecto
      </button>
    </div>
  );
}