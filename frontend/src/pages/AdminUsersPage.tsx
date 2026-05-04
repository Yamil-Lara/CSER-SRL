import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Search, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

interface AdminUser {
  id: number;
  nombre: string;
  email: string;
  profesion?: string;
  rol: string;
  activo: number | boolean;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get('/gestion/usuarios')
           .then(res => {
               // Normalización de la respuesta del backend
               let fetchedUsers = [];
               if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
                   fetchedUsers = res.data.data.data;
               } else if (res.data?.data && Array.isArray(res.data.data)) {
                   fetchedUsers = res.data.data;
               } else if (Array.isArray(res.data)) {
                   fetchedUsers = res.data;
               }
               setUsers(fetchedUsers);
           })
           .catch(err => console.error("Error cargando usuarios:", err))
           .finally(() => setLoading(false));
    }, []);

    const handleToggleStatus = async (userId: number, currentStatus: number | boolean) => {
        const newStatus = !currentStatus;
        try {
            await api.put(`/gestion/usuarios/${userId}`, { activo: newStatus });
            setUsers(users.map(user => user.id === userId ? { ...user, activo: newStatus } : user));
        } catch (err) {
            console.error("Error al actualizar el estado:", err);
        }
    };

    const filteredUsers = users.filter(user => 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.profesion && user.profesion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Títulos estáticos: Siempre visibles */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                    <Users className="w-8 h-8 text-primary" />
                    Gestión de Usuarios
                </h1>
                <p className="text-sidebar/70 mt-2">Administra los usuarios registrados en la plataforma</p>
            </div>

            {/* Buscador estático: Visible durante la carga */}
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

            {/* Condición de carga solo para el área de la tabla */}
            {loading ? (
                <div className="flex justify-center items-center h-64 bg-card border border-muted rounded-xl shadow-sm">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-card border border-muted rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-muted">
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Nombre</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Correo</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Profesión</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70">Rol</th>
                                <th className="py-4 px-6 font-semibold text-sm text-sidebar/70 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-muted/50 hover:bg-muted/20 transition-colors">
                                    <td className="py-4 px-6 text-sm font-medium">{user.nombre}</td>
                                    <td className="py-4 px-6 text-sm text-sidebar/70">{user.email}</td>
                                    <td className="py-4 px-6 text-sm text-sidebar/70">{user.profesion || '—'}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <Badge variant={user.rol === 'admin' ? 'destructive' : 'default'} className={user.rol === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}>
                                            {user.rol}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6 text-sm flex justify-center">
                                        <div 
                                            onClick={() => handleToggleStatus(user.id, user.activo)}
                                            className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${user.activo ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-sidebar/50">No se encontraron usuarios</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-muted flex justify-between items-center text-sm text-sidebar/70 bg-muted/10">
                        <span>Total de usuarios: {users.length}</span>
                        <span>Activos: {users.filter(u => u.activo).length}</span>
                    </div>
                </div>
            )}
        </div>
    );
}