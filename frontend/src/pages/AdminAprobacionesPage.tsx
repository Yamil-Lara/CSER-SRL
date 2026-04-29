import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { CheckCircle, XCircle, ExternalLink, Code } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

interface ProyectoPendiente {
  id: number;
  titulo: string;
  descripcion: string;
  tecnologias: string;
  github: string | null;
  demo: string | null;
  estado: string;
  created_at: string;
  usuario: {
    nombre: string;
    email: string;
  };
  categoria: {
    nombre: string;
  };
}

export default function AdminAprobacionesPage() {
    const [proyectos, setProyectos] = useState<ProyectoPendiente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPendientes();
    }, []);

    const cargarPendientes = async () => {
        try {
            const res = await api.get('/admin/proyectos/pendientes');
            // Adaptamos según si viene con tu ApiResponseTrait
            const data = res.data?.data?.data || res.data?.data || res.data || [];
            setProyectos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando proyectos pendientes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleActualizarEstado = async (id: number, nuevoEstado: 'aprobado' | 'rechazado') => {
        try {
            await api.put(`/admin/proyectos/${id}/estado`, { estado: nuevoEstado });
            
            // Removemos el proyecto de la lista porque ya no está pendiente
            setProyectos(proyectos.filter(p => p.id !== id));
            
            // Aquí podrías agregar un toast/alerta de éxito
        } catch (err) {
            console.error("Error al actualizar el estado:", err);
            alert("No se pudo actualizar el estado del proyecto.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-sidebar">Aprobaciones Pendientes</h1>
                <p className="text-sidebar/70 mt-2">Revisa y modera los nuevos proyectos subidos por los usuarios.</p>
            </div>

            {proyectos.length === 0 ? (
                <div className="bg-card border border-muted rounded-xl p-12 text-center shadow-sm">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium text-sidebar">¡Todo al día!</h3>
                    <p className="text-sidebar/70 mt-1">No hay proyectos pendientes de revisión.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {proyectos.map(proyecto => (
                        <div key={proyecto.id} className="bg-card border border-muted rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                            
                            {/* Información principal */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-sidebar">{proyecto.titulo}</h2>
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
                                </div>
                                
                                <p className="text-sm text-sidebar/60 mb-4">
                                    Subido por <span className="font-semibold text-sidebar">{proyecto.usuario?.nombre}</span> ({proyecto.usuario?.email}) 
                                    en <span className="font-semibold">{proyecto.categoria?.nombre || 'General'}</span>
                                </p>
                                
                                <p className="text-sidebar/80 text-sm mb-4 line-clamp-3">
                                    {proyecto.descripcion}
                                </p>

                                <div className="mb-4 flex flex-wrap gap-2">
                                    {proyecto.tecnologias.split(',').map((tech, idx) => (
                                        <Badge key={idx} variant="default" className="bg-transparent border border-sidebar/20 text-sidebar/70 hover:bg-sidebar/5 text-xs">{tech.trim()}</Badge>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    {proyecto.github && (
                                        <a href={proyecto.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                                            <Code className="w-4 h-4" /> Ver Repositorio
                                        </a>
                                    )}
                                    {proyecto.demo && (
                                        <a href={proyecto.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                                            <ExternalLink className="w-4 h-4" /> Ver Demo
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-muted pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                <button 
                                    onClick={() => handleActualizarEstado(proyecto.id, 'aprobado')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <CheckCircle className="w-4 h-4" /> Aprobar
                                </button>
                                <button 
                                    onClick={() => handleActualizarEstado(proyecto.id, 'rechazado')}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <XCircle className="w-4 h-4" /> Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}