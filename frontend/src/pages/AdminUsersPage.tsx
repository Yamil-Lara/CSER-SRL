import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

interface AdminUser {
  id: number;
  nombre: string;
  email: string;
  username: string;
  profesion?: string;
  rol: string;
  activo: number | boolean;
  created_at: string;
}

// ─── Tipo del modal de confirmación ──────────────────────────────────────────
interface PendingAction {
  type: 'toggle' | 'delete';
  userId: number;
  currentStatus?: number | boolean; // solo para toggle
  userName: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    // Estado del modal de confirmación
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    // Efecto para debounce de búsqueda
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(1, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchUsers = (page: number, search: string) => {
        setLoading(true);
        let url = `/gestion/usuarios?page=${page}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        api.get(url)
           .then(res => {
               const responseData = res.data?.data;
               // Manejo de respuesta paginada de Laravel
               if (responseData && responseData.data) {
                   setUsers(responseData.data);
                   setCurrentPage(responseData.current_page);
                   setLastPage(responseData.last_page);
                   setTotalUsers(responseData.total);
               } 
               // Fallback por si la respuesta no viene paginada (array plano)
               else if (Array.isArray(responseData)) {
                   setUsers(responseData);
                   setCurrentPage(1);
                   setLastPage(1);
                   setTotalUsers(responseData.length);
               } else if (Array.isArray(res.data)) {
                   setUsers(res.data);
                   setCurrentPage(1);
                   setLastPage(1);
                   setTotalUsers(res.data.length);
               }
           })
           .catch(err => console.error("Error cargando usuarios:", err))
           .finally(() => setLoading(false));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= lastPage) {
            fetchUsers(newPage, searchTerm);
        }
    };

    // ── Acción real: cambiar estado ───────────────────────────────────────────
    const executeToggle = async (userId: number, currentStatus: number | boolean) => {
        if (authUser?.id === userId) return; // Protección adicional
        const newStatus = !currentStatus;
        try {
            await api.put(`/gestion/usuarios/${userId}`, { activo: newStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, activo: newStatus } : u));
        } catch (err) {
            console.error('Error al actualizar el estado:', err);
        }
    };

    // ── Acción real: eliminar ─────────────────────────────────────────────────
    const executeDelete = async (userId: number) => {
        if (authUser?.id === userId) return; // Protección adicional
        try {
            await api.delete(`/gestion/usuarios/${userId}`);
            // Si eliminamos, lo quitamos de la lista actual. Lo ideal sería recargar la página actual para traer el siguiente.
            fetchUsers(currentPage, searchTerm);
        } catch (err) {
            console.error('Error al eliminar el usuario:', err);
            alert('No se pudo eliminar al usuario. Es posible que tenga proyectos asociados.');
        }
    };

    // ── Confirmar la acción pendiente ─────────────────────────────────────────
    const handleConfirm = () => {
        if (!pendingAction) return;
        if (pendingAction.type === 'toggle') {
            executeToggle(pendingAction.userId, pendingAction.currentStatus!);
        } else {
            executeDelete(pendingAction.userId);
        }
        setPendingAction(null);
    };

    // ── Textos del modal según la acción ─────────────────────────────────────
    const dialogConfig = pendingAction
        ? pendingAction.type === 'toggle'
        ? {
            title: pendingAction.currentStatus
                ? `¿Desactivar a ${pendingAction.userName}?`
                : `¿Activar a ${pendingAction.userName}?`,
            description: pendingAction.currentStatus
                ? `El usuario "${pendingAction.userName}" perderá acceso a la plataforma de inmediato. Podrás reactivarlo en cualquier momento.`
                : `El usuario "${pendingAction.userName}" recuperará acceso a la plataforma de inmediato.`,
            confirmLabel: pendingAction.currentStatus ? 'Sí, desactivar' : 'Sí, activar',
            variant: (pendingAction.currentStatus ? 'warning' : 'warning') as 'warning' | 'danger',
            }
        : {
            title: `¿Eliminar a ${pendingAction.userName}?`,
            description: `Esta acción eliminará permanentemente al usuario "${pendingAction.userName}" y todos sus datos asociados. Esta operación no se puede deshacer.`,
            confirmLabel: 'Sí, eliminar',
            variant: 'danger' as const,
            }
        : null;

    return (
        <div className="p-6 max-w-7xl mx-auto relative pb-24">
            {/* ── Botón volver ──────────────────────────────────────────────────── */}
            <Link
                to="/gestion/dashboard"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
            >
                <ChevronLeft className="w-4 h-4" />
                Volver al Panel de Administración
            </Link>

            {/* Títulos estáticos */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                    <Users className="w-8 h-8 text-primary" />
                    Gestión de Usuarios
                </h1>
                <p className="text-sidebar/70 mt-2">Administra los usuarios registrados en la plataforma</p>
            </div>

            {/* Buscador estático conectado al backend */}
            <div className="bg-card border border-muted rounded-xl p-2 mb-6 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar/40 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre, email o profesión..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-muted/30 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* Tabla de Usuarios */}
            {loading && users.length === 0 ? (
                <div className="flex justify-center items-center h-64 bg-card border border-muted rounded-xl shadow-sm w-full">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-card border border-muted rounded-xl shadow-sm overflow-x-auto relative w-full">
                    {/* Overlay de carga al cambiar de página */}
                    {loading && users.length > 0 && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-muted">
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Nombre</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Correo</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Profesión</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Rol</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70 text-center">Estado</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70 text-center">Registro</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={`border-b border-muted/50 transition-colors ${authUser?.id === user.id ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
                                    <td className="py-4 px-6 text-sm font-medium">
                                        <div className="flex flex-col">
                                            <span>{user.nombre}</span>
                                            <span className="text-xs text-sidebar/50">@{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-sidebar/70">{user.email}</td>
                                    <td className="py-4 px-6 text-sm text-sidebar/70">{user.profesion || '—'}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={user.rol === 'admin' ? 'destructive' : 'default'} className={user.rol === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}>
                                                {user.rol}
                                            </Badge>
                                            {authUser?.id === user.id && (
                                                <span className="text-[10px] bg-sidebar text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">Tú</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm flex justify-center items-center h-[72px]">
                                        <div 
                                            onClick={() => {
                                                if (authUser?.id === user.id) return;
                                                setPendingAction({
                                                    type: 'toggle',
                                                    userId: user.id,
                                                    currentStatus: user.activo,
                                                    userName: user.nombre,
                                                });
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${authUser?.id === user.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${user.activo ? 'bg-green-500' : 'bg-gray-300'}`}
                                            title={authUser?.id === user.id ? "No puedes bloquearte a ti mismo" : (user.activo ? "Bloquear Usuario" : "Desbloquear Usuario")}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-center text-sidebar/70 whitespace-nowrap">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <div className="flex justify-center items-center gap-2">
                                            <button 
                                                onClick={() => window.open(`/portfolio/${user.username}`, '_blank')}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                title="Ver portafolio público"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (authUser?.id === user.id) return;
                                                    setPendingAction({
                                                        type: 'delete',
                                                        userId: user.id,
                                                        userName: user.nombre,
                                                    });
                                                }}
                                                className={`p-2 rounded-full transition-colors ${authUser?.id === user.id ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                                                title={authUser?.id === user.id ? "No puedes eliminar tu propia cuenta" : "Eliminar permanentemente"}
                                                disabled={authUser?.id === user.id}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-sidebar/50 bg-muted/10">No se encontraron usuarios.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Controles de Paginación y Resumen */}
                    <div className="p-4 border-t border-muted flex flex-col md:flex-row justify-between items-center text-sm text-sidebar/70 bg-muted/10 gap-4">
                        <span>Total de registros: <strong className="text-sidebar">{totalUsers}</strong></span>
                        
                        {lastPage > 1 && (
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-medium text-sidebar">
                                    Página {currentPage} de {lastPage}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === lastPage}
                                    className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* ── Modal de confirmación ─────────────────────────────────────────── */}
            {dialogConfig && (
                <ConfirmDialog
                    isOpen={!!pendingAction}
                    onClose={() => setPendingAction(null)}
                    onConfirm={handleConfirm}
                    title={dialogConfig.title}
                    description={dialogConfig.description}
                    confirmLabel={dialogConfig.confirmLabel}
                    variant={dialogConfig.variant}
                />
            )}
        </div>
    );
}