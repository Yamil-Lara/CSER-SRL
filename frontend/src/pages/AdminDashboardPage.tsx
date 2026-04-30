import React from 'react';
import { LayoutDashboard, BarChart3 } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function AdminDashboardPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-sidebar flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-primary" />
                    Vista Global
                </h1>
                <p className="text-sidebar/70 mt-2">Resumen general y métricas del sistema</p>
            </div>

            <Card className="p-12 text-center border-dashed border-2 border-muted bg-muted/10">
                <BarChart3 className="w-12 h-12 text-sidebar/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-sidebar">Métricas en Construcción</h3>
                <p className="text-sidebar/60 mt-2">
                    Próximamente aquí se visualizarán los gráficos y estadísticas principales del sistema.
                </p>
            </Card>
        </div>
    );
}