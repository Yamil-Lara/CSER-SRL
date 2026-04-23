import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink, MessageSquare, Send, CalendarDays, User } from "lucide-react";
import { FiGithub as FiGithubIcon } from "react-icons/fi";

// Solución para el tipo de icono de react-icons
const FiGithub: any = FiGithubIcon;

const ProjectDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [comentario, setComentario] = useState("");

    // Mock de datos interno para mostrar info coherente con el clic en ExplorePage
    const proyectosMock = {
        "1": { titulo: "ejemplo1", autor: "Ana García", cat: "Desarrollo Web", tech: ["React", "TailwindCSS", "Vite"] },
        "2": { titulo: "ejemplo2", autor: "Carlos Ruiz", cat: "Mobile", tech: ["Flutter", "Firebase", "Dart"] }
    };

    // Obtenemos la info del proyecto según el ID de la URL
    const info = proyectosMock[id as keyof typeof proyectosMock] || { titulo: "Proyecto Individual", autor: "Autor", cat: "Categoría", tech: ["Tech"] };

    const Badge = ({ children }: { children: React.ReactNode }) => (
        <span className="px-4 py-1.5 bg-white text-slate-600 rounded-full text-xs font-semibold border border-slate-200 shadow-sm transition-all hover:border-blue-200">
            {children}
        </span>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900">

            {/* NAVBAR (Con el botón Volver centrado visualmente) */}
            <nav className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="text-2xl font-black text-[#3B82F6] cursor-pointer" onClick={() => navigate('/')}>DevFolio</div>
                <button
                    onClick={() => navigate('/explorar')}
                    className="flex items-center gap-2.5 text-slate-500 hover:text-[#3B82F6] font-semibold transition-colors text-sm"
                >
                    <ChevronLeft size={20} className="stroke-[2.5]" /> Volver al explorador
                </button>
            </nav>

            <main className="max-w-7xl mx-auto py-16 px-6 md:px-10">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-center">

                    <div className="md:col-span-7">
                        <div className="aspect-[16/10] bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center justify-center overflow-hidden p-4">
                            {/* Gráfico minimalista simulando carga de imagen */}
                            <div className="flex flex-col items-center gap-3 opacity-20">
                                <div className="w-24 h-2.5 bg-slate-200 rounded-full"></div>
                                <div className="w-40 h-2.5 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Lado Derecho: Detalles Rápidos y Acciones */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.25em]">{info.cat}</span>
                            <div className="h-px flex-grow bg-slate-100"></div>
                        </div>

                        <h1 className="text-5xl font-black text-slate-950 leading-tight tracking-tighter">{info.titulo}</h1>

                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <div className="flex items-center gap-2.5 text-slate-400">
                                    <CalendarDays size={18} />
                                    <span className="font-semibold uppercase tracking-wider text-xs">Realizado</span>
                                </div>
                                <span className="text-slate-700 font-bold">11 Marzo, 2026</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 text-sm border-t border-slate-100 pt-5">
                                <div className="flex items-center gap-2.5 text-slate-400">
                                    <User size={18} />
                                    <span className="font-semibold uppercase tracking-wider text-xs">Autor</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                        {info.autor.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-slate-950 font-extrabold">{info.autor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción Principales */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button className="bg-[#3B82F6] text-white font-bold py-4 rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 text-base active:scale-[0.98]">
                                <ExternalLink size={20} className="stroke-2" /> Demo En Vivo
                            </button>
                            <button className="bg-white text-slate-800 border border-slate-200 font-bold py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 text-base active:scale-[0.98]">
                                <FiGithub size={20} className="stroke-2" /> Ver Código
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* COLUMNA PRINCIPAL (8/12): Descripción y Comentarios */}
                    <div className="md:col-span-8 flex flex-col gap-10">

                        {/* SECCIÓN: Sobre el proyecto (Criterio de Aceptación 1) */}
                        <section className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-extrabold text-slate-950 mb-6 flex items-center gap-3">
                                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                Sobre el proyecto
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-base space-y-4">
                                <p>
                                    Esta es la descripción detallada del proyecto tal como se solicita en el criterio de aceptación 1 de la HU-07 del PDF proporcionado. Aquí se explican las herramientas utilizadas, el propósito del software y las funcionalidades principales.
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                                <h3 className="text-2xl font-extrabold text-slate-950 flex items-center gap-3">
                                    <MessageSquare className="text-blue-500" size={26} />
                                    Comentarios
                                </h3>
                                <span className="bg-slate-100 text-slate-500 font-bold text-sm px-3 py-1 rounded-full">0</span>
                            </div>

                            <div className="flex gap-5 mb-12 items-start bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 shadow-inner flex items-center justify-center text-slate-400 font-bold">U</div>
                                <div className="flex-grow flex flex-col gap-3">
                                    <textarea
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="Comparte tu opinión o haz una pregunta sobre el proyecto..."
                                        className="w-full border border-slate-200 rounded-2xl p-5 text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none bg-white transition-all resize-none"
                                        rows={4}
                                    />
                                    <button className="bg-slate-950 text-white px-8 py-3 rounded-xl text-base font-bold flex items-center gap-2.5 ml-auto hover:bg-slate-800 transition-colors active:scale-95 disabled:opacity-50" disabled={!comentario.trim()}>
                                        <Send size={18} /> Publicar comentario
                                    </button>
                                </div>
                            </div>

                            {/* Estado vacío (Placeholder del PDF) */}
                            <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[24px]">
                                <MessageSquare size={60} className="mx-auto text-slate-200 mb-5 stroke-1" />
                                <h4 className="text-xl font-bold text-slate-700 mb-1">Aún no hay comentarios</h4>
                                <p className="text-slate-400 font-medium max-w-xs mx-auto">Sé el primero en iniciar la conversación sobre este increíble proyecto.</p>
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-4">
                        <div className="bg-white rounded-[32px] p-9 border border-slate-100 shadow-sm sticky top-28">
                            <div className="flex items-center gap-3 mb-8">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Tecnologías</h4>
                                <div className="h-px flex-grow bg-slate-100"></div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {info.tech.map(tech => (
                                    <Badge key={tech}>{tech}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER (Opcional, para cerrar el diseño) */}
            <footer className="mt-20 py-10 border-t border-slate-100 bg-white text-center text-slate-400 text-sm">
                DevFolio © 2026 • Compartiendo conocimiento
            </footer>
        </div>
    );
};

export default ProjectDetailPage;