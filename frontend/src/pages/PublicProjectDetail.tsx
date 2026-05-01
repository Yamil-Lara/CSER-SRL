import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { buildUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';

interface Comentario {
    id: number;
    contenido: string;
    created_at: string;
    usuario: {
        nombre: string;
        apellido: string;
    };
}

// CORRECCIÓN: Interfaz mapeada exactamente a tu modelo Proyecto.php
interface Proyecto {
    id: number;
    titulo: string;
    descripcion: string;
    tecnologias?: string;
    herramientas?: string;
    imagen?: string;
    github?: string;
    demo?: string;
    cliente?: string;
    fecha_proyecto?: string;
}

const PublicProjectDetail: React.FC = () => {
    const { username, projectId } = useParams<{ username: string, projectId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); 

    const [proyecto, setProyecto] = useState<Proyecto | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchProjectAndComments = async () => {
            try {
                // Obtener detalle del proyecto (asegúrate de que la ruta sea correcta según tus configuraciones previas)
                const projRes = await axios.get(`/portafolio/${username}/proyectos/${projectId}`);
                setProyecto(projRes.data.data);

                // Obtener comentarios aprobados
                const commRes = await axios.get(`/proyectos/${projectId}/comentarios`);
                setComentarios(commRes.data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar el proyecto o los comentarios.');
            } finally {
                setLoading(false);
            }
        };

        if (projectId && username) fetchProjectAndComments();
    }, [username, projectId]);

    const handleSubmitComentario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;

        try {
            await axios.post(`/proyectos/${projectId}/comentarios`, {
                contenido: nuevoComentario
            });
            setSuccessMsg('Comentario enviado exitosamente. Pendiente de aprobación por un administrador.');
            setNuevoComentario(''); 
            
            setTimeout(() => setSuccessMsg(''), 6000);
        } catch (err) {
            console.error(err);
            setError('Hubo un problema al enviar el comentario.');
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Cargando proyecto...</div>;
    if (!proyecto) return <div className="text-center py-10 text-red-500">Proyecto no encontrado.</div>;

    // Función auxiliar para renderizar badges de tecnologías/herramientas
    const renderTags = (itemsString?: string) => {
        if (!itemsString) return null;
        const items = itemsString.split(',').map(item => item.trim());
        return items.map((item, index) => (
            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                {item}
            </span>
        ));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Botón: Volver al portafolio */}
            <button 
                onClick={() => navigate(`/portfolio/${username}`)}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Volver al portafolio
            </button>

            {/* Detalle del Proyecto Completo */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
                {/* CORRECCIÓN: Usar 'imagen' en lugar de 'imagen_url' y armar la ruta si es local */}
                {proyecto.imagen && (
                    <img 
                        src={buildUrl(proyecto.imagen)} 
                        alt={proyecto.titulo} 
                        className="w-full h-80 object-cover" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                )}
                
                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{proyecto.titulo}</h1>
                        {proyecto.fecha_proyecto && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {new Date(proyecto.fecha_proyecto).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {proyecto.cliente && (
                        <p className="text-sm text-gray-600 mb-6 font-medium">Cliente: {proyecto.cliente}</p>
                    )}

                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">{proyecto.descripcion}</p>
                    
                    {/* Tecnologías y Herramientas */}
                    {(proyecto.tecnologias || proyecto.herramientas) && (
                        <div className="mb-6 border-t pt-4">
                            {proyecto.tecnologias && (
                                <div className="mb-3">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2">Tecnologías:</h3>
                                    <div>{renderTags(proyecto.tecnologias)}</div>
                                </div>
                            )}
                            {proyecto.herramientas && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-700 mb-2">Herramientas:</h3>
                                    <div>{renderTags(proyecto.herramientas)}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Enlaces (Demo y GitHub) */}
                    <div className="flex space-x-4 mt-6">
                        {proyecto.demo && (
                            <a href={proyecto.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Ver Demo
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        )}
                        {proyecto.github && (
                            <a href={proyecto.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                                Código en GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección de Comentarios (Se mantiene igual) */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-inner border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Comentarios</h2>

                {error && <Alert type="error" className="mb-4" message={error} />}
                {successMsg && <Alert type="success" className="mb-4" message={successMsg} />}

                {isAuthenticated ? (
                    <form onSubmit={handleSubmitComentario} className="mb-10">
                        <Textarea 
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Escribe tu opinión o realiza una pregunta sobre este proyecto..."
                            className="w-full mb-3"
                            rows={3}
                            required
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!nuevoComentario.trim()}>
                                Publicar Comentario
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
                        Debes <a href="/login" className="font-bold underline hover:text-yellow-900">iniciar sesión</a> para dejar un comentario.
                    </div>
                )}

                <div className="space-y-6">
                    {comentarios.length > 0 ? (
                        comentarios.map(comentario => (
                            <div key={comentario.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-gray-900">
                                        {comentario.usuario?.nombre} {comentario.usuario?.apellido}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(comentario.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700">{comentario.contenido}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-center py-4">No hay comentarios aún. ¡Anímate a ser el primero!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProjectDetail;