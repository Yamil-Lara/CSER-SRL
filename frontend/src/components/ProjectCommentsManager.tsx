import React, { useState, useEffect } from "react";
import { Check, X, MessageSquare, Clock, Trash2 } from "lucide-react";
import api from "../utils/api";

// Interfaz para los comentarios en la vista de administración
interface ComentarioAdmin {
    id: number;
    contenido: string;
    fecha?: string;
    created_at?: string;
    aprobado: number | boolean; // 0 (Pendiente), 1 (Aprobado), 2 (Rechazado)
    autor?: {
        nombre: string;
    };
    usuario?: {
        nombre: string;
    };
}

interface ProjectCommentsManagerProps {
    proyectoId: string | number;
}

const ProjectCommentsManager: React.FC<ProjectCommentsManagerProps> = ({ proyectoId }) => {
    const [comentarios, setComentarios] = useState<ComentarioAdmin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Obtener TODOS los comentarios del proyecto
    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/proyectos/${proyectoId}/comentarios/admin`);
                
                const data = Array.isArray(response.data.data) ? response.data.data : response.data;
                setComentarios(data);
            } catch (err) {
                console.error("Error al cargar comentarios:", err);
                setError("No se pudieron cargar los comentarios.");
            } finally {
                setLoading(false);
            }
        };

        if (proyectoId) {
            fetchComentarios();
        }
    }, [proyectoId]);

    // Función para cambiar el estado (Aprobar = 1, Rechazar = 2)
    const handleCambiarEstado = async (comentarioId: number, nuevoEstado: number) => {
        try {
            await api.put(`/comentarios/${comentarioId}/estado`, {
                aprobado: nuevoEstado
            });

            // Actualizamos el estado localmente
            setComentarios(prev => 
                prev.map(c => c.id === comentarioId ? { ...c, aprobado: nuevoEstado } : c)
            );
        } catch (err) {
            console.error("Error al actualizar el estado del comentario:", err);
            alert("Hubo un problema al actualizar el estado.");
        }
    };

    // Función para eliminar un comentario (Dueño del proyecto)
    const handleEliminarComentario = async (comentarioId: number) => {
        if (!window.confirm("¿Estás seguro de eliminar este comentario permanentemente? Esta acción no se puede deshacer.")) return;

        try {
            await api.delete(`/comentarios/${comentarioId}`);
            
            // Quitamos el comentario de la lista local
            setComentarios(prev => prev.filter(c => c.id !== comentarioId));
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("No se pudo eliminar el comentario.");
        }
    };

    // Función para determinar el estilo del Badge según el estado
    const renderEstadoBadge = (estado: number | boolean) => {
        if (estado === 1 || estado === true) {
            return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"><Check size={14}/> Aprobado</span>;
        } else if (estado === 2) {
            return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"><X size={14}/> Rechazado</span>;
        } else {
            return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"><Clock size={14}/> Pendiente</span>;
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-500 font-medium">Cargando comentarios...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500 font-medium">{error}</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
            {/* Header del gestor */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-500" />
                    Gestión de Comentarios
                </h3>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
                    {comentarios.length} Total
                </span>
            </div>

            {/* Lista de comentarios */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {comentarios.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        No hay comentarios en este proyecto aún.
                    </div>
                ) : (
                    comentarios.map((comentario) => {
                        const nombreAutor = comentario.autor?.nombre || comentario.usuario?.nombre || 'Usuario Desconocido';
                        const fechaComentario = comentario.fecha || comentario.created_at || 'Fecha desconocida';
                        
                        return (
                            <div key={comentario.id} className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                
                                {/* Info del Comentario */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{nombreAutor}</span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">• {fechaComentario}</span>
                                        {renderEstadoBadge(comentario.aprobado)}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{comentario.contenido}</p>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:mt-0 mt-3">
                                    <button
                                        onClick={() => handleCambiarEstado(comentario.id, 1)}
                                        disabled={comentario.aprobado === 1}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors ${
                                            comentario.aprobado === 1 
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent dark:border-slate-700' 
                                                : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800'
                                        }`}
                                    >
                                        <Check size={16} /> Aprobar
                                    </button>
                                    
                                    <button
                                        onClick={() => handleCambiarEstado(comentario.id, 2)}
                                        disabled={comentario.aprobado === 2}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors ${
                                            comentario.aprobado === 2 
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent dark:border-slate-700' 
                                                : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800'
                                        }`}
                                    >
                                        <X size={16} /> Rechazar
                                    </button>

                                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                                    <button
                                        onClick={() => handleEliminarComentario(comentario.id)}
                                        className="px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800"
                                        title="Eliminar permanentemente"
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProjectCommentsManager;