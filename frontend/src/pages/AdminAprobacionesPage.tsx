import React, { useEffect, useState } from 'react';
import api, { buildUrl } from '../utils/api';
import { 
    CheckCircle, XCircle, Clock, LayoutGrid, Code, ExternalLink, 
    Search, Calendar, User, Tag, Briefcase, Wrench, Eye, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export default function AdminAprobacionesPage() {
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, pendientes: 0, aprobados: 0, rechazados: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/gestion/proyectos?estado=${filter}`);
            const data = res.data?.data;
            setProyectos(data?.proyectos || []);
            setStats(data?.stats || { total: 0, pendientes: 0, aprobados: 0, rechazados: 0 });
        } catch (err) {
            console.error("Error cargando proyectos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, nuevoEstado: string) => {
        try {
            await api.put(`/gestion/proyectos/${id}/estado`, { estado: nuevoEstado });
            fetchData(); // Recargamos la lista local de la página
            
            // NUEVO: Disparamos un evento global para avisarle al Sidebar
            window.dispatchEvent(new Event('proyectoActualizado'));
            
        } catch (err) {
            alert("Error al actualizar el estado");
        }
    };

    const proyectosFiltrados = proyectos.filter(p => {
        const busqueda = searchTerm.toLowerCase();
        return (
            p.titulo.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda) ||
            (p.usuario?.nombre || '').toLowerCase().includes(busqueda) ||
            (p.cliente || '').toLowerCase().includes(busqueda) ||
            (p.categoria?.nombre || '').toLowerCase().includes(busqueda)
        );
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-2">
            {/* ── Botón volver ─────────────────────────────────────────────── */}
            <Link
                to="/gestion/dashboard"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-2"
            >
                <ChevronLeft className="w-4 h-4" />
                Volver al Panel de Administración
            </Link>

            <header>
                <div>
                    <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-primary" />
                        Aprobación de Proyectos
                    </h1>
                    <p className="text-sidebar/70 mt-2">Gestiona, revisa y analiza detalladamente los proyectos de la comunidad.</p>
                </div>
            </header>

            {/* DASHBOARD DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-sidebar">
                    <div className="bg-sidebar/10 p-3 rounded-lg text-sidebar"><LayoutGrid /></div>
                    <div><p className="text-xs text-sidebar/60">Total</p><p className="text-xl font-bold">{stats.total}</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-yellow-500 shadow-sm">
                    <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><Clock /></div>
                    <div><p className="text-xs text-sidebar/60">Pendientes</p><p className="text-xl font-bold">{stats.pendientes}</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-green-500 shadow-sm">
                    <div className="bg-green-100 p-3 rounded-lg text-green-600"><CheckCircle /></div>
                    <div><p className="text-xs text-sidebar/60">Aprobados</p><p className="text-xl font-bold">{stats.aprobados}</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-red-500 shadow-sm">
                    <div className="bg-red-100 p-3 rounded-lg text-red-600"><XCircle /></div>
                    <div><p className="text-xs text-sidebar/60">Rechazados</p><p className="text-xl font-bold">{stats.rechazados}</p></div>
                </Card>
            </div>

            {/* FILTROS */}
            <div className="space-y-4">
                <div className="flex gap-2 border-b border-muted pb-px">
                    {['todos', 'pendiente', 'aprobado', 'rechazado'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-6 py-3 text-sm font-medium transition-all border-b-2 capitalize ${filter === opt ? 'border-primary text-primary' : 'border-transparent text-sidebar/60 hover:text-sidebar'}`}
                        >
                            {opt === 'todos' ? 'Ver Todos' : opt + 's'}
                        </button>
                    ))}
                </div>

                <div className="bg-card border border-muted rounded-xl p-2 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar/40 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar por título, descripción, usuario, cliente o categoría..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-muted/30 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* LISTADO DE PROYECTOS DETALLADO */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : proyectosFiltrados.length === 0 ? (
                <div className="text-center py-12 text-sidebar/50 bg-muted/20 rounded-xl border border-dashed border-muted">No se encontraron proyectos.</div>
            ) : (
                <div className="grid gap-6">
                    {proyectosFiltrados.map((p) => (
                        <Card key={p.id} className="overflow-hidden border-muted shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col lg:flex-row">
                                {/* Imagen del proyecto (si existe) */}
                                {p.imagen && (
                                    <div className="lg:w-64 h-48 lg:h-auto bg-muted">
                                        <img src={buildUrl(p.imagen)} alt={p.titulo} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                
                                <div className="p-6 flex-1 space-y-4">
                                    {/* Encabezado */}
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-sidebar">{p.titulo}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-sidebar/60">
                                                <span className="flex items-center gap-1"><User className="w-4 h-4"/> {p.usuario?.nombre}</span>
                                                <span className="flex items-center gap-1"><Tag className="w-4 h-4"/> {p.categoria?.nombre}</span>
                                                {p.cliente && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> Cliente: {p.cliente}</span>}
                                                {p.fecha_proyecto && <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(p.fecha_proyecto).toLocaleDateString()}</span>}
                                            </div>
                                        </div>
                                        <Badge variant={
                                            p.estado === 'pendiente' ? 'warning' : 
                                            p.estado === 'aprobado' ? 'success' : 'destructive'
                                        }>
                                            {p.estado.toUpperCase()}
                                        </Badge>
                                    </div>

                                    {/* Descripción completa */}
                                    <p className="text-sidebar/80 leading-relaxed text-sm">
                                        {p.descripcion}
                                    </p>

                                    {/* Tecnologías y Herramientas */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs font-bold text-sidebar/40 uppercase mb-2 flex items-center gap-1"><Code className="w-3 h-3"/> Tecnologías</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.tecnologias.split(',').map((t: string, i: number) => (
                                                    <Badge key={i} variant="default" className="bg-primary/5 text-primary border-primary/10 text-[10px]">{t.trim()}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        {p.herramientas && (
                                            <div>
                                                <p className="text-xs font-bold text-sidebar/40 uppercase mb-2 flex items-center gap-1"><Wrench className="w-3 h-3"/> Herramientas</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {p.herramientas.split(',').map((h: string, i: number) => (
                                                        <Badge key={i} variant="default" className="bg-sidebar/5 text-sidebar border-sidebar/10 text-[10px]">{h.trim()}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer de la tarjeta: Vistas y Links */}
                                    <div className="flex items-center justify-between pt-4 border-t border-muted">
                                        <div className="flex items-center gap-6 text-sm">
                                            <span className="flex items-center gap-1.5 text-sidebar/60"><Eye className="w-4 h-4"/> {p.vistas || 0} vistas</span>
                                            <div className="flex gap-4">
                                                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary font-medium hover:underline"><Code className="w-4 h-4"/> GitHub</a>}
                                                {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary font-medium hover:underline"><ExternalLink className="w-4 h-4"/> Demo</a>}
                                            </div>
                                        </div>

                                        {/* Botones de acción lateral */}
                                        <div className="flex gap-2">
                                            {p.estado !== 'aprobado' && (
                                                <button onClick={() => handleUpdateStatus(p.id, 'aprobado')} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-xs font-bold">
                                                    <CheckCircle className="w-4 h-4" /> APROBAR
                                                </button>
                                            )}
                                            {p.estado !== 'rechazado' && (
                                                <button onClick={() => handleUpdateStatus(p.id, 'rechazado')} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-xs font-bold">
                                                    <XCircle className="w-4 h-4" /> RECHAZAR
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}