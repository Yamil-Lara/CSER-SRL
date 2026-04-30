import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Activity, Search, Copy, Check } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

// Sub-componente para manejar el estado del botón "Copiar" por cada fila
const LogRow = ({ log }: { log: any }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(log.message);
        setCopied(true);
        // Regresa al ícono original después de 2 segundos
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 border-b border-muted/50 hover:bg-muted/5 flex gap-4 items-start group transition-colors">
            <span className="text-sidebar/40 whitespace-nowrap mt-1 font-mono">{log.date}</span>
            <Badge variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARNING' ? 'warning' : 'success'} className="w-20 flex justify-center py-0 mt-0.5">
                {log.level}
            </Badge>
            
            {/* Contenedor del texto: Limitamos la altura visualmente, pero conservamos todo el texto */}
            <div className="flex-1 overflow-hidden">
                <div className="text-sidebar/80 text-[13px] break-all whitespace-pre-wrap max-h-24 overflow-y-auto pr-2 scrollbar-thin">
                    {log.message}
                </div>
            </div>

            {/* Botón de copiar: Aparece al pasar el cursor (group-hover) */}
            <button 
                onClick={handleCopy} 
                className={`p-2 flex-shrink-0 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-600' : 'text-sidebar/40 hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100'}`}
                title="Copiar error completo"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
};

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/logs');
            setLogs(res.data.data);
        } catch (err) { 
            console.error("Error al cargar logs"); 
        } finally { 
            setLoading(false); 
        }
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
                <button onClick={fetchLogs} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                    Actualizar
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="bg-card border border-muted rounded-xl shadow-sm overflow-hidden font-mono text-[13px]">
                    <div className="max-h-[600px] overflow-y-auto">
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, i) => (
                                <LogRow key={i} log={log} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-sidebar/40 font-sans">
                                No se encontraron registros de actividad.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}