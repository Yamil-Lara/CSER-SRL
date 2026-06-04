import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { FiGithub as FiGithubIcon } from "react-icons/fi";
import { PublicHeader } from "../components/layout/PublicHeader";
import ProjectComments from "../components/ProjectComments";
import api, { buildUrl } from "../utils/api";

const FiGithub: any = FiGithubIcon;

interface Categoria {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  foto: string | null;
}

interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  tecnologias: string | null;
  imagen: string | null;
  github: string | null;
  demo: string | null;
  fecha_proyecto: string | null;
  categoria: Categoria | null;
  usuario: Usuario | null;
}

const ProjectDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [proyecto, setProyecto] = useState<Proyecto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/proyectos/${id}`);
                if (response.data.success) {
                    setProyecto(response.data.data);
                } else {
                    setError("No se pudo cargar el proyecto");
                }
            } catch (err: any) {
                console.error("Error fetching project:", err);
                setError(err.response?.data?.message || "Error al cargar el proyecto");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    const Badge = ({ children }: { children: React.ReactNode }) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
            {children}
        </span>
    );

    if (loading) {
        return <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">Cargando...</div>;
    }

    if (error || !proyecto) {
        return <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center text-red-500">{error || "Proyecto no encontrado"}</div>;
    }

    let tecnologiasArray: string[] = [];
    try {
        if (proyecto.tecnologias) {
            tecnologiasArray = proyecto.tecnologias.startsWith('[') 
                ? JSON.parse(proyecto.tecnologias) 
                : proyecto.tecnologias.split(',').map((t: string) => t.trim());
        }
    } catch (e) {
        console.error("Error parsing technologies:", e);
    }


    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <PublicHeader />

            <main className="max-w-5xl mx-auto py-12 px-6 pt-28">
                <button
                    onClick={() => navigate('/explorar')}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#3B82F6] font-medium transition-colors mb-6"
                >
                    <ChevronLeft size={20} /> Volver al explorador
                </button>
                
                {/* --- SECCIÓN SUPERIOR: Info del proyecto --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    <div className="md:col-span-7">
                        <div className="aspect-video bg-slate-100 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                            {proyecto.imagen ? (
                                <img src={buildUrl(proyecto.imagen) || ""} alt={proyecto.titulo} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <span className="text-sm font-bold uppercase">Sin imagen</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col justify-center">
                        <Badge>{proyecto.categoria?.nombre || "Sin categoría"}</Badge>
                        <h1 className="text-4xl font-black text-slate-900 mt-4 mb-6">{proyecto.titulo}</h1>

                        <div className="space-y-4 mb-8">
                            {proyecto.fecha_proyecto && (
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Fecha de realización</span>
                                    <span className="text-slate-700 font-medium">{new Date(proyecto.fecha_proyecto).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 mt-4">
                                {proyecto.usuario?.foto ? (
                                    <img src={buildUrl(proyecto.usuario.foto) || ""} alt={proyecto.usuario.nombre} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {proyecto.usuario?.nombre.substring(0, 2).toUpperCase() || "US"}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Autor</p>
                                    <p className="text-slate-800 font-bold">{proyecto.usuario?.nombre || "Desconocido"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {proyecto.demo && (
                                <a href={proyecto.demo} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#3B82F6] text-white font-bold py-3 rounded-xl hover:bg-blue-600 shadow-lg flex items-center justify-center gap-2">
                                    <ExternalLink size={18} /> Demo
                                </a>
                            )}
                            {proyecto.github && (
                                <a href={proyecto.github} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-slate-700 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
                                    <FiGithub size={18} /> Código
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN INFERIOR --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-8">
                        <section className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm mb-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Sobre el proyecto</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {proyecto.descripcion || "Sin descripción detallada."}
                            </p>
                        </section>

                        {/* --- LLAMADA AL NUEVO COMPONENTE DE COMENTARIOS --- */}
                        <ProjectComments proyectoId={id} proyectoAutorId={proyecto.usuario?.id} />

                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm sticky top-8">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Tecnologías</h4>
                            <div className="flex flex-wrap gap-2">
                                {tecnologiasArray.length > 0 ? tecnologiasArray.map((tech: string, index: number) => (
                                    <Badge key={index}>{tech}</Badge>
                                )) : (
                                    <span className="text-slate-500 text-sm">No especificadas</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailPage;