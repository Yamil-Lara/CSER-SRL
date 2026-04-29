import React from 'react';
import AdminCommentModeration from '../components/AdminCommentModeration';
import { MessageSquare } from 'lucide-react';

export default function AdminCommentPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-2">
      <div>
        <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Moderación de Comentarios
        </h1>
        <p className="text-sidebar/70 mt-2">
          Gestiona y modera los comentarios de todos los proyectos del sistema
        </p>
      </div>

      <AdminCommentModeration />
    </div>
  );
}