import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Interfaz que coincide con la respuesta de tu backend
interface Comentario {
    id: number;
    contenido: string;
    fecha: string;
    autor?: {
        id: number;
        nombre: string;
        username: string;
        foto?: string | null;
    };
}

interface ProjectCommentsProps {
    proyectoId?: string;
}

const ProjectComments: React.FC<ProjectCommentsProps> = ({ proyectoId }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    
    // Estados de autenticación y usuario
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Estados para los comentarios
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");

    // Efecto 1: Validar sesión y recuperar ID del usuario activo
    useEffect(() => {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);

        if (token) {
            // Intentamos sacar el usuario del localStorage (depende de cómo guardes tu sesión)
            const userStr = localStorage.getItem('authUser') || localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setCurrentUserId(user.id);
                } catch (e) {
                    console.error("Error parseando usuario", e);
                }
            } else {
                // Si no está en storage, pedimos el perfil al backend
                api.get('/profile').then(res => {
                    const data = res.data.data || res.data;
                    setCurrentUserId(data.id);
                }).catch(() => {});
            }
        }
    }, []);

    // Efecto 2: Obtener los comentarios del proyecto actual
    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                setLoadingComentarios(true);
                // Llama al endpoint público para ver los comentarios (que solo devuelve los aprobados == 1)
                const response = await api.get(`/proyectos/${proyectoId}/comentarios`);
                
                const data = Array.isArray(response.data.data) ? response.data.data : response.data;
                setComentarios(data);
            } catch (err) {
                console.error("Error al obtener los comentarios:", err);
            } finally {
                setLoadingComentarios(false);
            }
        };

        if (proyectoId) {
            fetchComentarios();
        }
    }, [proyectoId]);

    // Función para crear un nuevo comentario
    const handleEnviarComentario = async () => {
        if (!nuevoComentario.trim()) {
            setErrorMensaje("El comentario no puede estar vacío");
            return;
        }

        try {
            setSubmitting(true);
            setErrorMensaje("");
            
            const response = await api.post(`/proyectos/${proyectoId}/comentarios`, {
                contenido: nuevoComentario.trim()
            });

            const comentarioCreado = response.data.data || response.data;
            
            // Añadimos el nuevo comentario a la vista y limpiamos la caja de texto
            setComentarios(prev => [comentarioCreado, ...prev]);
            setNuevoComentario("");
            
        } catch (err: any) {
            console.error("Error al publicar el comentario:", err);
            setErrorMensaje("Hubo un problema al publicar tu comentario. Inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    // Función para que el autor pueda eliminar su propio comentario
    const handleEliminarComentario = async (comentarioId: number) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar tu comentario?")) return;

        try {
            await api.delete(`/comentarios/${comentarioId}`);
            // Removemos el comentario de la lista sin recargar la página
            setComentarios(prev => prev.filter(c => c.id !== comentarioId));
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("No se pudo eliminar el comentario.");
        }
    };

    return (
        <section className="bg-[var(--card)] rounded-[32px] p-8 border border-[var(--border-color)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-8 flex items-center gap-2">
                Comentarios <span className="bg-[var(--muted)] text-[var(--text-muted)] text-sm px-2 py-0.5 rounded-md">{comentarios.length}</span>
            </h3>

            {/* Muestra la caja de comentarios si el usuario inició sesión */}
            {isAuthenticated ? (
                !isAdmin ? (
                    <div className="flex gap-4 mb-10">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            Tú
                        </div>
                        <div className="flex-grow">
                            <textarea
                                value={nuevoComentario}
                                onChange={(e) => {
                                    setNuevoComentario(e.target.value);
                                    setErrorMensaje("");
                                }}
                                placeholder="Escribe un comentario o pregunta sobre el proyecto..."
                                className={`w-full border ${errorMensaje ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[var(--muted)] text-[var(--text-main)] resize-y placeholder:text-[var(--text-muted)]`}
                                rows={3}
                                disabled={submitting}
                            />
                            {errorMensaje && <p className="text-red-500 text-xs mt-2 ml-1">{errorMensaje}</p>}
                            <button 
                                onClick={handleEnviarComentario}
                                disabled={submitting}
                                className="mt-3 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ml-auto hover:bg-primary-hover transition-colors disabled:opacity-50"
                            >
                                <Send size={16} /> {submitting ? 'Publicando...' : 'Publicar'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[var(--muted)] border border-[var(--border-color)] rounded-2xl p-6 text-center mb-10 flex flex-col items-center justify-center">
                        <p className="text-[var(--text-muted)] font-medium">Como administrador, no puedes comentar en los proyectos.</p>
                    </div>
                )
            ) : (
                <div className="bg-[var(--muted)] border border-[var(--border-color)] rounded-2xl p-6 text-center mb-10 flex flex-col items-center justify-center">
                    <p className="text-[var(--text-muted)] mb-4 font-medium">Inicia sesión para dejar tu opinión o realizar preguntas sobre este trabajo.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-[#3B82F6] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 shadow-md transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            )}

            {/* Listado de comentarios aprobados */}
            <div className="mt-6 space-y-6">
                {loadingComentarios ? (
                    <p className="text-center text-sidebar/60 font-medium">Cargando comentarios...</p>
                ) : comentarios.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageSquare size={48} className="mx-auto text-[var(--border-color)] mb-3" />
                        <p className="text-sidebar/60 font-medium">Aún no hay comentarios. Sé el primero.</p>
                    </div>
                ) : (
                    comentarios.map((c) => (
                        <div key={c.id} className="flex gap-4 border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0 relative group">
                            <div className="w-10 h-10 bg-muted text-sidebar/60 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                {c.autor?.nombre ? c.autor.nombre.substring(0, 2).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <span className="font-bold text-sidebar">{c.autor?.nombre || 'Usuario Desconocido'}</span>
                                        <span className="text-xs text-sidebar/60 font-medium hidden sm:inline">•</span>
                                        <span className="text-xs text-sidebar/60 font-medium">{c.fecha}</span>
                                    </div>
                                    
                                    {/* Botón de basurero: Solo se renderiza si el ID del autor coincide con el ID del usuario en sesión */}
                                    {c.autor?.id === currentUserId && (
                                        <button 
                                            onClick={() => handleEliminarComentario(c.id)}
                                            className="text-sidebar/60 hover:text-red-500 transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Eliminar mi comentario"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-wrap">{c.contenido}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ProjectComments;