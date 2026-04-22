import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink, MessageSquare, Send } from "lucide-react";
import { FiGithub as FiGithubIcon } from "react-icons/fi";
import ProjectComments from "../components/ProjectComments";

const FiGithub: any = FiGithubIcon;

const ProjectDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [comentario, setComentario] = useState("");

    // Mock de datos interno para mostrar info coherente con el clic
    const proyectosMock = {
        "1": { titulo: "ejemplo1", autor: "Ana García", cat: "Desarrollo Web" },
        "2": { titulo: "ejemplo2", autor: "Carlos Ruiz", cat: "Mobile" }
    };

    const info = proyectosMock[id as keyof typeof proyectosMock] || { titulo: "Proyecto", autor: "Autor", cat: "Categoría" };

    const Badge = ({ children }: { children: React.ReactNode }) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
            {children}
        </span>
    );

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="text-2xl font-extrabold text-[#3B82F6] cursor-pointer" onClick={() => navigate('/')}>DevFolio</div>
                <button
                    onClick={() => navigate('/explorar')}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#3B82F6] font-medium transition-colors"
                >
                    <ChevronLeft size={20} /> Volver al explorador
                </button>
            </nav>

            <main className="max-w-5xl mx-auto py-12 px-6">
                {/* --- SECCIÓN SUPERIOR: Info del proyecto --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    <div className="md:col-span-7">
                        <div className="aspect-video bg-white rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                            <div className="text-slate-200 flex flex-col items-center">
                                <div className="w-20 h-2 bg-slate-100 rounded-full mb-2"></div>
                                <div className="w-32 h-2 bg-slate-50 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col justify-center">
                        <Badge>{info.cat}</Badge>
                        <h1 className="text-4xl font-black text-slate-900 mt-4 mb-6">{info.titulo}</h1>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Fecha de realización</span>
                                <span className="text-slate-700 font-medium">11 de marzo de 2026</span>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {info.autor.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Autor</p>
                                    <p className="text-slate-800 font-bold">{info.autor}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-[#3B82F6] text-white font-bold py-3 rounded-xl hover:bg-blue-600 shadow-lg flex items-center justify-center gap-2">
                                <ExternalLink size={18} /> Demo
                            </button>
                            <button className="flex-1 bg-white text-slate-700 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
                                <FiGithub size={18} /> Código
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN INFERIOR --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-8">
                        <section className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm mb-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Sobre el proyecto</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Esta es la descripción detallada del proyecto tal como se solicita en el criterio de aceptación 1 de la HU-07.
                            </p>
                        </section>

                        {/* --- LLAMADA AL NUEVO COMPONENTE DE COMENTARIOS --- */}
                        <ProjectComments proyectoId={id} />

                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm sticky top-8">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Tecnologías</h4>
                            <div className="flex flex-wrap gap-2">
                                {["React", "Tailwind", "Lucide Icons", "Vite"].map(tech => (
                                    <Badge key={tech}>{tech}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailPage;