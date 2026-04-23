import React from 'react';
import AdminCommentModeration from '../components/AdminCommentModeration';
import { MessageSquare } from 'lucide-react';

export default function AdminCommentPage() {
  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Moderación de Comentarios
          </h1>
          <p className="page-subtitle">
            Gestiona y modera los comentarios de todos los proyectos del sistema
          </p>
        </div>
      </header>

      <AdminCommentModeration />
    </div>
  );
}