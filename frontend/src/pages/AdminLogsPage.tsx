import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Activity, Search, AlertCircle, Info, bug } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        try {
            const res = await api.get('/admin/logs');
            setLogs(res.data.data);
        } catch (err) { console.error("Error al cargar logs"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLogs(); }, []);

    const filteredLogs = logs.filter(l => 
        l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                    <Activity className="w-8 h-8 text-primary" />
                    Registro de Actividad
                </h1>
                <p className="text-sidebar/70 mt-2">Auditoría del Sistema en Tiempo Real</p>
            </div>

            <div className="bg-card border border-muted rounded-xl p-2 shadow-sm flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar/40 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar en los registros de actividad..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-muted/30 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                </div>
                <button onClick={fetchLogs} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Actualizar</button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="bg-card border border-muted rounded-xl shadow-sm overflow-hidden font-mono text-[13px]">
                    <div className="max-h-[600px] overflow-y-auto">
                        {filteredLogs.map((log, i) => (
                            <div key={i} className="p-4 border-b border-muted/50 hover:bg-muted/5 flex gap-4 items-start">
                                <span className="text-sidebar/40 whitespace-nowrap">{log.date}</span>
                                <Badge variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARNING' ? 'warning' : 'success'} className="w-20 flex justify-center py-0">
                                    {log.level}
                                </Badge>
                                <span className="text-sidebar/80 break-all">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}