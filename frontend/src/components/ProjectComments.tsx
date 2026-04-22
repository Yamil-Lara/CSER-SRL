import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import api from "../api/axios";

// Interfaz para los comentarios
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

// Propiedades que recibirá el componente
interface ProjectCommentsProps {
    proyectoId?: string;
}

const ProjectComments: React.FC<ProjectCommentsProps> = ({ proyectoId }) => {
    const navigate = useNavigate();
    
    // Estado de autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Estados de los comentarios
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [loadingComentarios, setLoadingComentarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");

    // Verificar si el usuario está autenticado al cargar
    useEffect(() => {
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
    }, []);

    // Cargar los comentarios del proyecto
    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                setLoadingComentarios(true);
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

    // Función para enviar un nuevo comentario
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
            
            // Añadir al principio y limpiar el input
            setComentarios(prev => [comentarioCreado, ...prev]);
            setNuevoComentario("");
            
        } catch (err: any) {
            console.error("Error al publicar el comentario:", err);
            setErrorMensaje("Hubo un problema al publicar tu comentario. Inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                Comentarios <span className="bg-slate-100 text-slate-400 text-sm px-2 py-0.5 rounded-md">{comentarios.length}</span>
            </h3>

            {/* Formulario de comentarios (solo si hay token) */}
            {isAuthenticated ? (
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
                            className={`w-full border ${errorMensaje ? 'border-red-500' : 'border-slate-200'} rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 resize-y`}
                            rows={3}
                            disabled={submitting}
                        />
                        {errorMensaje && <p className="text-red-500 text-xs mt-2 ml-1">{errorMensaje}</p>}
                        <button 
                            onClick={handleEnviarComentario}
                            disabled={submitting}
                            className="mt-3 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ml-auto hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <Send size={16} /> {submitting ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center mb-10 flex flex-col items-center justify-center">
                    <p className="text-slate-600 mb-4 font-medium">Inicia sesión para dejar tu opinión o realizar preguntas sobre este trabajo.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-[#3B82F6] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 shadow-md transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            )}

            {/* Listado de comentarios */}
            <div className="mt-6 space-y-6">
                {loadingComentarios ? (
                    <p className="text-center text-slate-400 font-medium">Cargando comentarios...</p>
                ) : comentarios.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageSquare size={48} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-slate-400 font-medium">Aún no hay comentarios. Sé el primero.</p>
                    </div>
                ) : (
                    comentarios.map((c) => (
                        <div key={c.id} className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                            <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                {c.autor?.nombre ? c.autor.nombre.substring(0, 2).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                    <span className="font-bold text-slate-800">{c.autor?.nombre || 'Usuario Desconocido'}</span>
                                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                                    <span className="text-xs text-slate-400 font-medium">{c.fecha}</span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{c.contenido}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ProjectComments;