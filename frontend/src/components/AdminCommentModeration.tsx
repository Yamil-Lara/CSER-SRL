import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Trash2, Eye, EyeOff, Search,MessageSquare } from 'lucide-react';
import api from '../utils/api';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';

interface Comment {
  id: number;
  contenido: string;
  fecha: string;
  aprobado: number; // 0: pendiente, 1: aprobado, 2: rechazado
  autor: {
    id: number;
    nombre: string;
    username: string;
    foto?: string | null;
  };
  proyecto: {
    id: number;
    titulo: string;
    usuario: {
      nombre: string;
    };
  };
}

export default function AdminCommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  // Cargar todos los comentarios pendientes del sistema
  const loadComments = async () => {
    setLoading(true);
    try {
      // Endpoint para obtener comentarios pendientes a nivel sistema
      // Si no existe, puedes llamar a un endpoint que agrupe por proyecto
      const response = await api.get('/admin/comentarios/pendientes');
      setComments(response.data.data || response.data);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      setMessage({ type: 'error', text: 'Error al cargar los comentarios pendientes' });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar comentarios según el filtro seleccionado
  useEffect(() => {
    let filtered = [...comments];
    
    // Aplicar filtro por estado
    if (filter === 'pending') {
      filtered = filtered.filter(c => c.aprobado === 0);
    } else if (filter === 'approved') {
      filtered = filtered.filter(c => c.aprobado === 1);
    } else if (filter === 'rejected') {
      filtered = filtered.filter(c => c.aprobado === 2);
    }
    
    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.autor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredComments(filtered);
  }, [comments, filter, searchTerm]);

  // Aprobar comentario
  const handleApprove = async (commentId: number) => {
    setUpdating(commentId);
    try {
      await api.put(`/comentarios/${commentId}/estado`, { aprobado: 1 });
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, aprobado: 1 } : c
      ));
      setMessage({ type: 'success', text: 'Comentario aprobado correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al aprobar:', error);
      setMessage({ type: 'error', text: 'Error al aprobar el comentario' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUpdating(null);
    }
  };

  // Rechazar comentario
  const handleReject = async (commentId: number) => {
    setUpdating(commentId);
    try {
      await api.put(`/comentarios/${commentId}/estado`, { aprobado: 2 });
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, aprobado: 2 } : c
      ));
      setMessage({ type: 'success', text: 'Comentario rechazado correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al rechazar:', error);
      setMessage({ type: 'error', text: 'Error al rechazar el comentario' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUpdating(null);
    }
  };

  // Eliminar comentario permanentemente
  const handleDelete = async (commentId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario permanentemente?')) return;
    
    setUpdating(commentId);
    try {
      await api.delete(`/comentarios/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setMessage({ type: 'success', text: 'Comentario eliminado correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el comentario' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUpdating(null);
    }
  };

  // Obtener badge según estado
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} /> Pendiente</span>;
      case 1:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check size={12} /> Aprobado</span>;
      case 2:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><X size={12} /> Rechazado</span>;
      default:
        return null;
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.aprobado === 0).length,
    approved: comments.filter(c => c.aprobado === 1).length,
    rejected: comments.filter(c => c.aprobado === 2).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {message && <Alert type={message.type} message={message.text} className="mb-6" />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Aprobados</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rechazados</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <X size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendientes
            </Button>
            <Button
              variant={filter === 'approved' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('approved')}
            >
              Aprobados
            </Button>
            <Button
              variant={filter === 'rejected' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('rejected')}
            >
              Rechazados
            </Button>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar comentario, autor o proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No hay comentarios que coincidan con los filtros</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Contenido del comentario */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary">
                        {comment.autor.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{comment.autor.nombre}</span>
                        <span className="text-xs text-gray-500">@{comment.autor.username}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{comment.fecha}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">Proyecto: </span>
                        <span className="text-xs font-medium text-primary">"{comment.proyecto.titulo}"</span>
                        <span className="text-xs text-gray-500 ml-1">por {comment.proyecto.usuario.nombre}</span>
                      </div>
                      <p className="text-gray-700 mt-2">{comment.contenido}</p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2 md:flex-col items-end">
                  {getStatusBadge(comment.aprobado)}
                  <div className="flex gap-2 mt-2">
                    {comment.aprobado !== 1 && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        disabled={updating === comment.id}
                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <Check size={16} />
                        Aprobar
                      </button>
                    )}
                    {comment.aprobado !== 2 && (
                      <button
                        onClick={() => handleReject(comment.id)}
                        disabled={updating === comment.id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <X size={16} />
                        Rechazar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={updating === comment.id}
                      className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}