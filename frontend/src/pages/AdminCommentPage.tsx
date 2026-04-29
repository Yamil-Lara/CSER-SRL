import React from 'react';
import AdminCommentModeration from '../components/AdminCommentModeration';
import { MessageSquare } from 'lucide-react';

export default function AdminCommentPage() {
  return (
    <div>
      <header className="page-header">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sidebar">Moderación de Comentarios</h1>
          <p className="text-sidebar/70 mt-2">Gestiona y modera los comentarios de todos los proyectos del sistema</p>
        </div>
      </header>
      <AdminCommentModeration />
    </div>
  );
}