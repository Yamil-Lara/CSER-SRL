import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Database, Download, Trash2, RefreshCw, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function AdminBackupsPage() {
    const [backups, setBackups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBackups = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/backups');
            setBackups(res.data.data);
        } catch (err) {
            console.error("Error al cargar backups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBackups(); }, []);

    const handleCreate = async () => {
        try {
            await api.post('/admin/backups');
            fetchBackups();
        } catch (err) { alert("Error al generar backup"); }
    };

    const handleDownload = (filename: string) => {
        window.open(`http://localhost:8000/api/admin/backups/download/${filename}`, '_blank');
    };

    const handleDelete = async (filename: string) => {
        if (!confirm("¿Eliminar este respaldo?")) return;
        try {
            await api.delete(`/admin/backups/${filename}`);
            fetchBackups();
        } catch (err) { alert("Error al eliminar"); }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                        <Database className="w-8 h-8 text-primary" />
                        Respaldo de Información
                    </h1>
                    <p className="text-sidebar/70 mt-2">Seguridad y Copias del Sistema</p>
                </div>
                <button onClick={handleCreate} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">
                    <RefreshCw className="w-4 h-4" /> Generar Nuevo Backup
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="bg-card border border-muted rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="py-4 px-6 text-xs font-bold text-sidebar/50 uppercase">Nombre del Archivo</th>
                                <th className="py-4 px-6 text-xs font-bold text-sidebar/50 uppercase">Tamaño</th>
                                <th className="py-4 px-6 text-xs font-bold text-sidebar/50 uppercase">Fecha</th>
                                <th className="py-4 px-6 text-xs font-bold text-sidebar/50 uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backups.map((b, i) => (
                                <tr key={i} className="border-b border-muted/50 hover:bg-muted/10">
                                    <td className="py-4 px-6 text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" /> {b.name}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-sidebar/60">{b.size}</td>
                                    <td className="py-4 px-6 text-sm text-sidebar/60">{b.date}</td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        <button onClick={() => handleDownload(b.name)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Download className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(b.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}