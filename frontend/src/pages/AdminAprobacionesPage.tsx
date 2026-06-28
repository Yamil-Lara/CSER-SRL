import React, { useEffect, useState } from 'react';
import api, { buildUrl } from '../utils/api';
import { 
    CheckCircle, XCircle, Clock, LayoutGrid, Code, ExternalLink, 
    Search, Calendar, User, Tag, Briefcase, Wrench, Eye, FolderGit2,
    ChevronLeft, ChevronRight, Trash2, Mail
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // ← AGREGAR useLocation
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminAprobacionesPage() {
    const navigate = useNavigate();
    const location = useLocation(); // ← AGREGAR ESTO
    
    const [activeTab, setActiveTab] = useState<'proyectos' | 'usuarios'>('proyectos');
    const [proyectos, setProyectos] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    
    // Stats del dashboard
    const [dashboardStats, setDashboardStats] = useState<any>({
        total_usuarios: 0,
        total_proyectos: 0,
        pendientes_usuarios: 0,
        pendientes_proyectos: 0,
        aprobados_proyectos: 0,
        rechazados_proyectos: 0,
        aprobados_usuarios: 0,
        rechazados_usuarios: 0,
    });

    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    // Estados de paginación combinados
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Estado para confirmación de eliminación de proyecto
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null; titulo: string }>({
        open: false,
        id: null,
        titulo: '',
    });

    // ← NUEVO: Leer el estado de navegación para cambiar pestaña y filtro
    useEffect(() => {
        if (location.state) {
            if (location.state.activeTab === 'usuarios') {
                setActiveTab('usuarios');
                setFilter('pendiente');
                setSearchTerm('');
            }
        }
    }, [location.state]);

    // Cuando cambian el filtro o la pestaña, reseteamos la página a 1
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, activeTab]);

    // Ejecutamos la búsqueda cuando cambie la pestaña, filtro o página
    useEffect(() => {
        fetchData();
    }, [filter, activeTab, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Obtener stats globales
            const statsRes = await api.get('/gestion/dashboard/stats');
            const dStats = statsRes.data?.data || {};
            
            // 2. Obtener la lista según la pestaña activa
            if (activeTab === 'proyectos') {
                const res = await api.get(`/gestion/proyectos?estado=${filter}&page=${currentPage}`);
                const data = res.data?.data;
                const paginationData = data?.proyectos;
                
                let fetchedProjects = [];
                if (paginationData?.data) { // Si viene paginado
                    fetchedProjects = paginationData.data;
                    setLastPage(paginationData.last_page || 1);
                    setTotalItems(paginationData.total || fetchedProjects.length);
                } else if (Array.isArray(paginationData)) { // Si viene como array simple
                    fetchedProjects = paginationData;
                    setLastPage(1);
                    setTotalItems(fetchedProjects.length);
                }
                setProyectos(fetchedProjects);
                
                // Actualizamos las stats
                setDashboardStats({
                    ...dStats,
                    total_proyectos: data?.stats?.total || dStats.total_proyectos,
                    pendientes_proyectos: data?.stats?.pendientes || dStats.pendientes_proyectos,
                    aprobados_proyectos: data?.stats?.aprobados || 0,
                    rechazados_proyectos: data?.stats?.rechazados || 0
                });
            } else {
                const res = await api.get(`/gestion/usuarios?estado=${filter}&page=${currentPage}`);
                // Soporta estructura paginada o directa
                let fetchedUsers = [];
                if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
                    fetchedUsers = res.data.data.data;
                    setLastPage(res.data.data.last_page || 1);
                    setTotalItems(res.data.data.total || fetchedUsers.length);
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    fetchedUsers = res.data.data;
                    setLastPage(1);
                    setTotalItems(fetchedUsers.length);
                } else if (Array.isArray(res.data)) {
                    fetchedUsers = res.data;
                    setLastPage(1);
                    setTotalItems(fetchedUsers.length);
                }
                setUsuarios(fetchedUsers);
                
                // Actualizamos las stats usando los nuevos datos expuestos en el backend
                setDashboardStats({
                    ...dStats,
                    total_usuarios: dStats.total_usuarios || 0,
                    pendientes_usuarios: dStats.pendientes_usuarios || 0,
                    aprobados_usuarios: dStats.aprobados_usuarios || 0,
                    rechazados_usuarios: dStats.rechazados_usuarios || 0,
                });
            }
        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, nuevoEstado: string, type: 'proyectos' | 'usuarios') => {
        try {
            if (type === 'proyectos') {
                await api.put(`/gestion/proyectos/${id}/estado`, { estado: nuevoEstado });
                window.dispatchEvent(new Event('proyectoActualizado'));
            } else {
                await api.put(`/gestion/usuarios/${id}`, { estado: nuevoEstado });
                window.dispatchEvent(new Event('usuarioActualizado'));
            }
            fetchData(); // Recargamos
        } catch (err) {
            alert("Error al actualizar el estado");
        }
    };

    const handleResendEmail = async (id: number) => {
        try {
            await api.post(`/gestion/usuarios/${id}/reenviar-notificacion`);
            alert("Notificación reenviada exitosamente");
            fetchData(); // Recargamos
        } catch (err) {
            alert("Error al reenviar la notificación");
        }
    };

    const handleEliminarProyecto = async () => {
        if (!deleteConfirm.id) return;
        try {
            await api.delete(`/proyectos/${deleteConfirm.id}`);
            setDeleteConfirm({ open: false, id: null, titulo: '' });
            fetchData(); // Recargar datos
        } catch (err) {
            alert("Error al eliminar el proyecto");
        }
    };

    // Filtrado local (Buscador rápido dentro de la página cargada)
    const proyectosFiltrados = proyectos.filter(p => {
        const busqueda = searchTerm.toLowerCase();
        return (
            p.titulo.toLowerCase().includes(busqueda) ||
            p.descripcion.toLowerCase().includes(busqueda) ||
            (p.usuario?.nombre || '').toLowerCase().includes(busqueda) ||
            (p.cliente || '').toLowerCase().includes(busqueda) ||
            (p.categoria?.nombre || '').toLowerCase().includes(busqueda) ||
            (p.tecnologias || '').toLowerCase().includes(busqueda)
        );
    });

    const usuariosFiltrados = usuarios.filter(u => {
        const busqueda = searchTerm.toLowerCase();
        return (
            u.nombre.toLowerCase().includes(busqueda) ||
            u.email.toLowerCase().includes(busqueda) ||
            (u.profesion || '').toLowerCase().includes(busqueda) ||
            (u.username || '').toLowerCase().includes(busqueda)
        );
    });

    // Valores para las tarjetas superiores según la pestaña activa
    const displayStats = {
        total: activeTab === 'proyectos' ? dashboardStats.total_proyectos : dashboardStats.total_usuarios,
        pendientes: activeTab === 'proyectos' ? dashboardStats.pendientes_proyectos : dashboardStats.pendientes_usuarios,
        aprobados: activeTab === 'proyectos' ? dashboardStats.aprobados_proyectos : dashboardStats.aprobados_usuarios,
        rechazados: activeTab === 'proyectos' ? dashboardStats.rechazados_proyectos : dashboardStats.rechazados_usuarios
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-2 relative pb-24">
            {/* ── Botón volver ─────────────────────────────────────────────── */}
            <Link
                to="/gestion/dashboard"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-2"
            >
                <ChevronLeft className="w-4 h-4" />
                Volver al Panel de Administración
            </Link>

            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold  flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-primary" />
                        Aprobaciones del Sistema
                    </h1>
                    <p className="opacity-70 mt-2">Gestiona, revisa y analiza detalladamente proyectos y usuarios.</p>
                </div>
            </header>

            {/* TABS DE SELECCIÓN */}
            <div className="flex gap-4 border-b border-muted mb-6">
                <button
                    onClick={() => { setActiveTab('proyectos'); setFilter('todos'); setSearchTerm(''); }}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'proyectos' ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:'}`}
                >
                    <FolderGit2 className="w-4 h-4" /> Proyectos
                </button>
                <button
                    onClick={() => { setActiveTab('usuarios'); setFilter('todos'); setSearchTerm(''); }}
                    className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'usuarios' ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:'}`}
                >
                    <User className="w-4 h-4" /> Usuarios
                </button>
            </div>

            {/* DASHBOARD DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-sidebar">
                    <div className="bg-sidebar/10 p-3 rounded-lg "><LayoutGrid /></div>
                    <div><p className="text-xs opacity-60">Total {activeTab === 'proyectos' ? 'Proyectos' : 'Usuarios'}</p><p className="text-xl font-bold">{displayStats.total}</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-yellow-500 shadow-sm">
                    <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><Clock /></div>
                    <div><p className="text-xs opacity-60">Pendientes</p><p className="text-xl font-bold">{displayStats.pendientes}</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-green-500 shadow-sm opacity-80">
                    <div className="bg-green-100 p-3 rounded-lg text-green-600"><CheckCircle /></div>
                    <div><p className="text-xs opacity-60">Aprobados</p><p className="text-xl font-bold">{displayStats.aprobados}</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-red-500 shadow-sm opacity-80">
                    <div className="bg-red-100 p-3 rounded-lg text-red-600"><XCircle /></div>
                    <div><p className="text-xs opacity-60">Rechazados</p><p className="text-xl font-bold">{displayStats.rechazados}</p></div>
                </Card>
            </div>

            {/* FILTROS Y BUSCADOR */}
            <div className="space-y-4">
                <div className="flex gap-2 border-b border-muted pb-px overflow-x-auto scrollbar-hide whitespace-nowrap">
                    {['todos', 'pendiente', 'aprobado', 'rechazado'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-4 md:px-6 py-3 text-sm font-medium transition-all border-b-2 capitalize flex-shrink-0 ${filter === opt ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:'}`}
                        >
                            {opt === 'todos' ? 'Ver Todos' : opt + 's'}
                        </button>
                    ))}
                </div>

                <div className="bg-card border border-muted rounded-xl p-2 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder={activeTab === 'proyectos' ? "Buscar por título, descripción, usuario, cliente o categoría..." : "Buscar por nombre, email, profesión o username..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-muted/30 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* LISTADO DE ELEMENTOS */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : activeTab === 'proyectos' ? (
                // === VISTA DE PROYECTOS ===
                proyectosFiltrados.length === 0 ? (
                    <div className="text-center py-12 opacity-50 bg-muted/20 rounded-xl border border-dashed border-muted">
                        {filter === 'pendiente' ? 'Sin pendientes de revisión' : 'No se encontraron proyectos.'}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {proyectosFiltrados.map((p) => (
                            <Card key={p.id} className="overflow-hidden border-muted shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex flex-col lg:flex-row">
                                    {p.imagen && (
                                        <div className="w-full lg:w-64 h-48 bg-muted flex-shrink-0">
                                            <img src={buildUrl(p.imagen)} alt={p.titulo} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="p-4 md:p-6 flex-1 space-y-4 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold ">{p.titulo}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm opacity-60">
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

                                        <p className="opacity-80 leading-relaxed text-sm">
                                            {p.descripcion}
                                        </p>

                                        {p.tecnologias && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <p className="text-xs font-bold opacity-40 uppercase mb-2 flex items-center gap-1"><Code className="w-3 h-3"/> Tecnologías</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {p.tecnologias.split(',').map((t: string, i: number) => (
                                                            <Badge key={i} variant="default" className="bg-primary/5 text-primary border-primary/10 text-[10px]">{t.trim()}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                {p.herramientas && (
                                                    <div>
                                                        <p className="text-xs font-bold opacity-40 uppercase mb-2 flex items-center gap-1"><Wrench className="w-3 h-3"/> Herramientas</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {p.herramientas.split(',').map((h: string, i: number) => (
                                                                <Badge key={i} variant="default" className="bg-sidebar/5  border-sidebar/10 text-[10px]">{h.trim()}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-muted gap-4 mt-auto">
                                            <div className="flex items-center gap-6 text-sm">
                                                <button onClick={() => window.open(`/proyecto/${p.id}`, '_blank')} className="flex items-center gap-1 text-primary font-medium hover:underline">
                                                    <Eye className="w-4 h-4"/> Previsualizar Proyecto
                                                </button>
                                                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 opacity-60 hover:text-primary transition-colors"><Code className="w-4 h-4"/> GitHub</a>}
                                                {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 opacity-60 hover:text-primary transition-colors"><ExternalLink className="w-4 h-4"/> Demo</a>}
                                            </div>

                                            <div className="flex gap-2 w-full sm:w-auto">
                                                {p.estado !== 'aprobado' && (
                                                    <button onClick={() => handleUpdateStatus(p.id, 'aprobado', 'proyectos')} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-xs font-bold">
                                                        <CheckCircle className="w-4 h-4" /> APROBAR
                                                    </button>
                                                )}
                                                {p.estado !== 'rechazado' && (
                                                    <button onClick={() => handleUpdateStatus(p.id, 'rechazado', 'proyectos')} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-xs font-bold">
                                                        <XCircle className="w-4 h-4" /> RECHAZAR
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setDeleteConfirm({ open: true, id: p.id, titulo: p.titulo })} 
                                                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all text-xs font-bold"
                                                    title="Eliminar permanentemente"
                                                >
                                                    <Trash2 className="w-4 h-4" /> ELIMINAR
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            ) : (
                // === VISTA DE USUARIOS ===
                usuariosFiltrados.length === 0 ? (
                    <div className="text-center py-12 opacity-50 bg-muted/20 rounded-xl border border-dashed border-muted">
                        {filter === 'pendiente' ? 'Sin pendientes de revisión' : 'No se encontraron usuarios.'}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {usuariosFiltrados.map((u) => (
                            <Card key={u.id} className="overflow-hidden border-muted shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Avatar o Icono */}
                                    <div className="w-full lg:w-48 h-48 bg-muted/30 flex items-center justify-center flex-shrink-0 border-r border-muted/50">
                                        {u.foto ? (
                                            <img src={buildUrl(u.foto)} alt={u.nombre} className="w-32 h-32 rounded-full object-cover shadow-sm border-4 border-white" />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-sm border-4 border-muted">
                                                <User className="w-12 h-12 opacity-30" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-4 md:p-6 flex-1 space-y-4 min-w-0 flex flex-col">
                                        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold ">{u.nombre}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm opacity-60">
                                                    <span className="flex items-center gap-1 font-medium text-primary break-all">@{u.username}</span>
                                                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 flex-shrink-0"/> <span className="truncate">{u.profesion || 'Sin profesión'}</span></span>
                                                    <span className="flex items-center gap-1 break-all"><ExternalLink className="w-4 h-4 flex-shrink-0"/> {u.email}</span>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                u.estado === 'pendiente' ? 'warning' : 
                                                u.estado === 'aprobado' ? 'success' : 'destructive'
                                            }>
                                                {u.estado ? u.estado.toUpperCase() : 'PENDIENTE'}
                                            </Badge>
                                        </div>

                                        <p className="opacity-80 leading-relaxed text-sm flex-grow">
                                            {u.biografia || 'Sin biografía.'}
                                        </p>

                                        {u.especialidad && (
                                            <div className="pt-2">
                                                <p className="text-xs font-bold opacity-40 uppercase mb-2 flex items-center gap-1"><Code className="w-3 h-3"/> Especialidad</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {u.especialidad.split(',').map((esp: string, i: number) => (
                                                        <Badge key={i} variant="default" className="bg-primary/5 text-primary border-primary/10 text-[10px]">{esp.trim()}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-muted gap-4 mt-auto">
                                            <div className="flex items-center gap-6 text-sm">
                                                <button onClick={() => window.open(`/portfolio/${u.username}`, '_blank')} className="flex items-center gap-1 text-primary font-medium hover:underline">
                                                    <Eye className="w-4 h-4"/> Previsualizar Perfil Público
                                                </button>
                                            </div>

                                            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                                                {u.estado !== 'aprobado' && (
                                                    <button onClick={() => handleUpdateStatus(u.id, 'aprobado', 'usuarios')} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-xs font-bold">
                                                        <CheckCircle className="w-4 h-4" /> APROBAR
                                                    </button>
                                                )}
                                                {u.estado !== 'rechazado' && (
                                                    <button onClick={() => handleUpdateStatus(u.id, 'rechazado', 'usuarios')} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-xs font-bold">
                                                        <XCircle className="w-4 h-4" /> RECHAZAR
                                                    </button>
                                                )}
                                                
                                                <div className="w-full h-0 sm:hidden"></div>
                                                
                                                {u.estado !== 'pendiente' && (
                                                    <div className="flex items-center gap-2 px-2 py-1 bg-muted/20 border border-muted rounded-lg ml-auto sm:ml-4">
                                                        <span className="text-xs font-medium opacity-60">Aviso:</span>
                                                        {u.estado_notificacion === 'notificado' ? (
                                                            <span className="flex items-center gap-1 text-green-600 text-xs font-bold" title="El usuario fue notificado exitosamente">
                                                                <CheckCircle className="w-4 h-4" /> NOTIFICADO
                                                            </span>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                {u.estado_notificacion === 'error' ? (
                                                                    <span className="flex items-center gap-1 text-red-600 text-xs font-bold" title="Falló el envío del correo de notificación">
                                                                        <XCircle className="w-4 h-4" /> ERROR
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold">
                                                                        <Clock className="w-4 h-4" /> PENDIENTE
                                                                    </span>
                                                                )}
                                                                <button 
                                                                    onClick={() => handleResendEmail(u.id)}
                                                                    className="px-2 py-1 text-[10px] bg-primary hover:bg-primary-hover text-white rounded transition-colors font-bold uppercase flex items-center gap-1"
                                                                    title="Reintentar enviar el aviso por correo"
                                                                >
                                                                    <Mail className="w-3 h-3" /> Reenviar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            )}

            {/* Controles de Paginación */}
            {!loading && totalItems > 0 && (
                                                <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-70 bg-card p-4 rounded-xl border border-muted shadow-sm gap-4">
                                                    <span>Total de registros: <strong className="">{totalItems}</strong></span>
                                                    
                                                    {lastPage > 1 && (
                                                        <div className="flex items-center gap-4">
                                                            <button 
                                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                                disabled={currentPage === 1}
                                                                className="p-2 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <ChevronLeft className="w-5 h-5" />
                                                            </button>
                                                            <span className="font-medium ">
                                                                Página {currentPage} de {lastPage}
                                                            </span>
                                                            <button 
                                                                onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                                                                disabled={currentPage === lastPage}
                                                                className="p-2 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <ChevronRight className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Confirm Modal Eliminar Proyecto */}
                                            <ConfirmModal
                                                show={deleteConfirm.open}
                                                onClose={() => setDeleteConfirm({ open: false, id: null, titulo: '' })}
                                                onConfirm={handleEliminarProyecto}
                                                title="Eliminar Proyecto"
                                                message={`¿Estás seguro de que deseas eliminar permanentemente el proyecto "${deleteConfirm.titulo}"? Esta acción no se puede deshacer y también eliminará todos los comentarios asociados.`}
                                            />
                                        </div>
                                    );
                                }
