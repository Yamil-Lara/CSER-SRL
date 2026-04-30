import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { CheckCircle, XCircle, Clock, LayoutGrid, Search, User, FolderGit2, Calendar, MessageSquare } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

export default function AdminCommentModeration() {
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Utilizamos la ruta que creaste para traer todos los comentarios
            const res = await api.get('/admin/comentarios/pendientes');
            const data = res.data?.data || [];
            setComentarios(data);
        } catch (err) {
            console.error("Error cargando comentarios:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, nuevoEstado: number) => {
        try {
            // 1. Enviamos el cambio de estado (Aprobar o Rechazar) a la base de datos
            await api.put(`/comentarios/${id}/estado`, { aprobado: nuevoEstado });
            
            // 2. IMPORTANTE: Usamos 'await' para esperar a que los datos se recarguen completamente en esta vista primero
            await fetchData(); 
            
            // 3. Una vez que tenemos la certeza de que la DB se actualizó, avisamos al Sidebar
            window.dispatchEvent(new Event('comentarioActualizado'));
            
        } catch (err) {
            console.error("Error actualizando comentario:", err);
            alert("Error al actualizar el estado del comentario.");
        }
    };

    // ==========================================
    // 1. CÁLCULO DE ESTADÍSTICAS LOCALES
    // ==========================================
    const stats = {
        total: comentarios.length,
        pendientes: comentarios.filter(c => c.aprobado === 0).length,
        aprobados: comentarios.filter(c => c.aprobado === 1).length,
        rechazados: comentarios.filter(c => c.aprobado === 2).length,
    };

    // ==========================================
    // 2. LÓGICA DE FILTRADO (Tabs + Texto)
    // ==========================================
    const comentariosFiltrados = comentarios.filter(c => {
        // Filtro por Pestañas
        let matchTab = true;
        if (filter === 'pendiente') matchTab = c.aprobado === 0;
        if (filter === 'aprobado') matchTab = c.aprobado === 1;
        if (filter === 'rechazado') matchTab = c.aprobado === 2;

        // Filtro por Texto (Buscador)
        const busqueda = searchTerm.toLowerCase();
        const matchText = 
            (c.contenido || '').toLowerCase().includes(busqueda) ||
            (c.autor?.nombre || '').toLowerCase().includes(busqueda) ||
            (c.proyecto?.titulo || '').toLowerCase().includes(busqueda);

        return matchTab && matchText;
    });

    // Función auxiliar para obtener los estilos y etiquetas del estado
    const getEstadoInfo = (estadoCode: number) => {
        if (estadoCode === 1) return { label: 'APROBADO', variant: 'success' as const };
        if (estadoCode === 2) return { label: 'RECHAZADO', variant: 'destructive' as const };
        return { label: 'PENDIENTE', variant: 'warning' as const };
    };

    return (
        <div>
            {/* DASHBOARD DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 border-l-4 border-l-sidebar">
                    <div className="bg-sidebar/10 p-3 rounded-lg text-sidebar"><MessageSquare /></div>
                    <div><p className="text-xs text-sidebar/60">Total Comentarios</p><p className="text-xl font-bold">{stats.total}</p></div>
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

            {/* FILTROS (Tabs y Buscador) */}
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
                            placeholder="Buscar por contenido del comentario, autor o proyecto..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-muted/30 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* LISTADO DE COMENTARIOS */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : comentariosFiltrados.length === 0 ? (
                <div className="text-center py-12 text-sidebar/50 bg-muted/20 rounded-xl border border-dashed border-muted">No se encontraron comentarios.</div>
            ) : (
                <div className="grid gap-4">
                    {comentariosFiltrados.map((c) => {
                        const estado = getEstadoInfo(c.aprobado);
                        return (
                            <Card key={c.id} className="overflow-hidden border-muted shadow-md hover:shadow-lg transition-shadow p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    
                                    <div className="flex-1 space-y-4">
                                        {/* Encabezado: Autor y Estado */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {c.autor?.foto ? (
                                                    <img src={c.autor.foto} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-muted" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {c.autor?.nombre?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sidebar text-sm">{c.autor?.nombre}</p>
                                                    <p className="text-xs text-sidebar/60">@{c.autor?.username}</p>
                                                </div>
                                            </div>
                                            <Badge variant={estado.variant}>{estado.label}</Badge>
                                        </div>

                                        {/* Contenido del comentario */}
                                        <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                                            <p className="text-sidebar/80 italic text-sm">"{c.contenido}"</p>
                                        </div>

                                        {/* Contexto del comentario (Proyecto y Fecha) */}
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-sidebar/60 bg-primary/5 p-3 rounded-lg border border-primary/10">
                                            <span className="flex items-center gap-1.5"><FolderGit2 className="w-4 h-4 text-primary"/> Proyecto: <strong className="text-sidebar">{c.proyecto?.titulo}</strong></span>
                                            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary"/> Creador: {c.proyecto?.usuario?.nombre}</span>
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary"/> Fecha: {c.fecha}</span>
                                        </div>
                                    </div>

                                    {/* Botones de acción lateral */}
                                    <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-muted pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                        {c.aprobado !== 1 && (
                                            <button onClick={() => handleUpdateStatus(c.id, 1)} className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" /> Aprobar
                                            </button>
                                        )}
                                        {c.aprobado !== 2 && (
                                            <button onClick={() => handleUpdateStatus(c.id, 2)} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium">
                                                <XCircle className="w-4 h-4" /> Rechazar
                                            </button>
                                        )}
                                    </div>
                                    
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}