import React from 'react';
import api from '../utils/api'; 
import { FileText, Download, Users, FolderGit2, MessageSquare, PieChart } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function AdminReportesPage() {
    
    const handleDownload = async (type: string) => {
        try {
            // 1. Hacemos la petición con Axios para que incluya el Token de sesión
            const response = await api.get(`/panel/reportes/${type}`, {
                responseType: 'blob' 
            });

            // 2. Creamos un enlace temporal en memoria con el archivo recibido
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            
            // 3. Le asignamos un nombre al archivo y forzamos la descarga
            link.setAttribute('download', `reporte_${type}_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // 4. Limpiamos la memoria
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Error al descargar el PDF:", error);
            alert("Hubo un error al generar el reporte. Verifica la consola para más detalles.");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Encabezado con estilo unificado */}
            <div>
                <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    Reportes PDF
                </h1>
                <p className="text-sidebar/70 mt-2">Exportación de datos y estadísticas del sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Reporte de Usuarios */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-muted">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <Users className="text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-sidebar">Listado de Usuarios</h3>
                    <p className="text-sm text-sidebar/60 mt-2 mb-6">
                        Genera un documento con todos los usuarios registrados, sus roles y estado actual.
                    </p>
                    <button 
                        onClick={() => handleDownload('usuarios')}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Descargar PDF
                    </button>
                </Card>

                {/* Reporte de Proyectos */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-muted">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <FolderGit2 className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-sidebar">Métricas de Proyectos</h3>
                    <p className="text-sm text-sidebar/60 mt-2 mb-6">
                        Exporta el rendimiento de los proyectos, incluyendo vistas, categorías y estados de aprobación.
                    </p>
                    <button 
                        onClick={() => handleDownload('proyectos')}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Descargar PDF
                    </button>
                </Card>

                {/* Reporte de Comentarios */}
                <Card className="p-6 hover:shadow-lg transition-shadow border-muted">
                    <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <MessageSquare className="text-orange-600 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-sidebar">Moderación de Comentarios</h3>
                    <p className="text-sm text-sidebar/60 mt-2 mb-6">
                        Auditoría completa del feedback de los usuarios, incluyendo estados de aprobación y proyectos destino.
                    </p>
                    <button 
                        onClick={() => handleDownload('comentarios')}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Descargar PDF
                    </button>
                </Card>

                {/* Reporte Estadístico (Próximamente) */}
                <Card className="p-6 border-dashed border-2 border-muted bg-muted/5">
                    <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <PieChart className="text-purple-600 w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-sidebar/50">Resumen Ejecutivo</h3>
                    <p className="text-sm text-sidebar/40 mt-2 mb-6">
                        Reporte consolidado de actividad mensual y crecimiento de la plataforma.
                    </p>
                    <button disabled className="w-full bg-muted text-sidebar/30 py-2.5 rounded-lg font-medium cursor-not-allowed">
                        En Desarrollo
                    </button>
                </Card>

            </div>
        </div>
    );
}