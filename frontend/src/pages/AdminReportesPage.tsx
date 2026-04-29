import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function AdminReportesPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        Reportes PDF
                    </h1>
                    <p className="text-sidebar/70 mt-2">Exportación de datos y estadísticas del sistema</p>
                </div>
            </div>

            <Card className="p-12 text-center border-dashed border-2 border-muted bg-muted/10">
                <FileText className="w-12 h-12 text-sidebar/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-sidebar">Módulo de Exportación</h3>
                <p className="text-sidebar/60 mt-2">
                    Aquí podrás generar y descargar reportes personalizados en formato PDF.
                </p>
            </Card>
        </div>
    );
}