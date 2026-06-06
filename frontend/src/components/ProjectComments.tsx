import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
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
    likes?: number;
    dislikes?: number;
    user_interaction?: 'like' | 'dislike' | null;
    respuestas?: Comentario[];
}

interface ProjectCommentsProps {
    proyectoId?: string;
    proyectoAutorId?: number;
}

const ProjectComments: React.FC<ProjectCommentsProps> = ({ proyectoId, proyectoAutorId }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    
    // Estados de autenticación y usuario
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
    const [dislikedComments, setDislikedComments] = useState<Set<number>>(new Set());
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState("");

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

                // Pre-popular los likes y dislikes del usuario actual según lo devuelto por el backend
                const initialLikes = new Set<number>();
                const initialDislikes = new Set<number>();
                data.forEach((c: Comentario) => {
                    if (c.user_interaction === 'like') initialLikes.add(c.id);
                    if (c.user_interaction === 'dislike') initialDislikes.add(c.id);
                });
                setLikedComments(initialLikes);
                setDislikedComments(initialDislikes);
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
    const handleEnviarComentario = async (parentId?: number) => {
        const contentToSubmit = parentId ? replyContent.trim() : nuevoComentario.trim();
        if (!contentToSubmit) {
            setErrorMensaje("El comentario no puede estar vacío");
            return;
        }

        try {
            setSubmitting(true);
            setErrorMensaje("");
            
            const payload: any = { contenido: contentToSubmit };
            if (parentId) {
                payload.parent_id = parentId;
            }

            const response = await api.post(`/proyectos/${proyectoId}/comentarios`, payload);
            const comentarioCreado = response.data.data || response.data;
            
            if (parentId) {
                // Agregar la respuesta al comentario padre en el estado
                setComentarios(prev => prev.map(c => {
                    if (c.id === parentId) {
                        return { ...c, respuestas: [...(c.respuestas || []), comentarioCreado] };
                    }
                    return c;
                }));
                setReplyingTo(null);
                setReplyContent("");
            } else {
                setComentarios(prev => [comentarioCreado, ...prev]);
                setNuevoComentario("");
            }
            
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
                    <div className="flex gap-4 mb-10" id="caja-comentarios">
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
                                onClick={() => handleEnviarComentario()}
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
                                    
                                    {/* Botón de basurero */}
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
                                <p className="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-wrap mb-2">{c.contenido}</p>
                                
                                {/* Lógica de exclusividad para el autor del proyecto */}
                                {(() => {
                                    const isOwner = proyectoAutorId === currentUserId;
                                    const ownerHasReplied = c.respuestas?.some(r => r.autor?.id === currentUserId);
                                    const userHasLiked = likedComments.has(c.id);
                                    const userHasDisliked = dislikedComments.has(c.id);

                                    // El autor solo puede dar Like/Dislike si no ha respondido. Los demás siempre pueden.
                                    const showLikeDislike = isOwner ? !ownerHasReplied : true;
                                    // El autor solo puede responder si no ha dado Like ni Dislike.
                                    const showReply = isOwner ? !(userHasLiked || userHasDisliked) : false;

                                    return (
                                        <div className="flex items-center gap-4 mt-2">
                                            {showLikeDislike && (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={async () => {
                                                            if (!isAuthenticated) return navigate('/login');
                                                            try {
                                                                const res = await api.post(`/comentarios/${c.id}/like`);
                                                                const { likes, dislikes, user_interaction } = res.data.data || res.data;
                                                                
                                                                setComentarios(prev => prev.map(comp => 
                                                                    comp.id === c.id ? { ...comp, likes, dislikes, user_interaction } : comp
                                                                ));

                                                                const newLikes = new Set(likedComments);
                                                                const newDislikes = new Set(dislikedComments);
                                                                
                                                                if (user_interaction === 'like') {
                                                                    newLikes.add(c.id);
                                                                    newDislikes.delete(c.id);
                                                                } else {
                                                                    newLikes.delete(c.id);
                                                                }
                                                                
                                                                setLikedComments(newLikes);
                                                                setDislikedComments(newDislikes);

                                                            } catch (e) {
                                                                console.error("Error al dar like");
                                                            }
                                                        }}
                                                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${userHasLiked ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                                        title="Me gusta"
                                                    >
                                                        <ThumbsUp size={16} className={userHasLiked ? "fill-current" : ""} />
                                                        {c.likes || 0}
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            if (!isAuthenticated) return navigate('/login');
                                                            try {
                                                                const res = await api.post(`/comentarios/${c.id}/dislike`);
                                                                const { likes, dislikes, user_interaction } = res.data.data || res.data;
                                                                
                                                                setComentarios(prev => prev.map(comp => 
                                                                    comp.id === c.id ? { ...comp, likes, dislikes, user_interaction } : comp
                                                                ));

                                                                const newLikes = new Set(likedComments);
                                                                const newDislikes = new Set(dislikedComments);
                                                                
                                                                if (user_interaction === 'dislike') {
                                                                    newDislikes.add(c.id);
                                                                    newLikes.delete(c.id);
                                                                } else {
                                                                    newDislikes.delete(c.id);
                                                                }
                                                                
                                                                setLikedComments(newLikes);
                                                                setDislikedComments(newDislikes);

                                                            } catch (e) {
                                                                console.error("Error al dar dislike");
                                                            }
                                                        }}
                                                        className={`flex items-center gap-1 text-xs font-semibold transition-colors ml-1 ${userHasDisliked ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                                        title="No me gusta"
                                                    >
                                                        <ThumbsDown size={16} className={userHasDisliked ? "fill-current" : ""} />
                                                    </button>
                                                </div>
                                            )}

                                            {showReply && (
                                                <button 
                                                    onClick={() => {
                                                        setReplyingTo(replyingTo === c.id ? null : c.id);
                                                        setReplyContent(`@${c.autor?.username || c.autor?.nombre} `);
                                                    }}
                                                    className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors ml-2"
                                                >
                                                    Responder
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Caja de respuesta (solo si este es el comentario activo) */}
                                {replyingTo === c.id && (
                                    <div className="mt-4 flex gap-3">
                                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            Tú
                                        </div>
                                        <div className="flex-grow">
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Escribe tu respuesta..."
                                                className="w-full border border-[var(--border-color)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[var(--card)] text-[var(--text-main)] resize-y placeholder:text-[var(--text-muted)]"
                                                rows={2}
                                                disabled={submitting}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button 
                                                    onClick={() => setReplyingTo(null)}
                                                    className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-1.5"
                                                    disabled={submitting}
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    onClick={() => handleEnviarComentario(c.id)}
                                                    disabled={submitting || !replyContent.trim()}
                                                    className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-hover disabled:opacity-50"
                                                >
                                                    {submitting ? 'Enviando...' : 'Responder'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Renderizar Respuestas Anidadas */}
                                {c.respuestas && c.respuestas.length > 0 && (
                                    <div className="mt-4 space-y-4 pl-4 sm:pl-10 border-l-2 border-[var(--border-color)]">
                                        {c.respuestas.map((r) => (
                                            <div key={r.id} className="flex gap-3 relative group">
                                                <div className="w-8 h-8 bg-[var(--muted)] text-[var(--text-muted)] rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                    {r.autor?.nombre ? r.autor.nombre.substring(0, 2).toUpperCase() : 'U'}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5">
                                                                {r.autor?.nombre || 'Usuario Desconocido'}
                                                                {r.autor?.id === proyectoAutorId && (
                                                                    <span className="bg-[var(--muted)] text-[var(--text-muted)] text-[10px] uppercase px-1.5 py-0.5 rounded-full">Autor</span>
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-[var(--text-muted)] font-medium">{r.fecha}</span>
                                                        </div>
                                                        {r.autor?.id === currentUserId && (
                                                            <button 
                                                                onClick={() => {
                                                                    api.delete(`/comentarios/${r.id}`).then(() => {
                                                                        setComentarios(prev => prev.map(comp => 
                                                                            comp.id === c.id ? { ...comp, respuestas: comp.respuestas?.filter(resp => resp.id !== r.id) } : comp
                                                                        ));
                                                                    });
                                                                }}
                                                                className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                                title="Eliminar mi respuesta"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-wrap">{r.contenido}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ProjectComments;