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
            const res = await api.get('/gestion/backups');
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
            await api.post('/gestion/backups');
            fetchBackups();
        } catch (err) { alert("Error al generar backup"); }
    };

    const handleDownload = async (filename: string) => {
        try {
            // 1. Hacemos la petición con Axios para que incluya el Token de sesión
            // IMPORTANTE: responseType: 'blob' le dice a Axios que recibirá un archivo
            const response = await api.get(`/gestion/backups/download/${filename}`, {
                responseType: 'blob' 
            });

            // 2. Creamos un enlace temporal en memoria con el archivo recibido
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // 3. Le asignamos el nombre original al archivo y forzamos la descarga
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // 4. Limpiamos la memoria
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Error al descargar el backup:", error);
            alert("Hubo un error al descargar el archivo. Verifica la consola para más detalles.");
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm("¿Eliminar este respaldo?")) return;
        try {
            await api.delete(`/gestion/backups/${filename}`);
            fetchBackups();
        } catch (err) { alert("Error al eliminar"); }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-sidebar flex items-center gap-3">
                        <Database className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        Respaldo de Información
                    </h1>
                    <p className="text-sidebar/70 mt-2 text-sm sm:text-base">Seguridad y Copias del Sistema</p>
                </div>
                <button onClick={handleCreate} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">
                    <RefreshCw className="w-4 h-4" /> Generar Nuevo Backup
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="bg-card border border-muted rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse min-w-[800px]">
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