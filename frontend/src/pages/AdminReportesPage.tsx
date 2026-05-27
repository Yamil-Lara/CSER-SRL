import React, { useState, useCallback } from 'react';
import api from '../utils/api';
import {
  FileText, Download, Users, FolderGit2, MessageSquare,
  PieChart, Calendar, RefreshCw, FileSpreadsheet,
  AlertTriangle, TrendingUp, Clock, ChevronDown
} from 'lucide-react';
import { Card } from '../components/ui/Card';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type TipoReporte = 'usuarios' | 'proyectos' | 'comentarios' | 'general';
type PeriodoPreset = 'mes_actual' | 'mes_anterior' | 'ultimos_3_meses' | 'personalizado';

interface StatsUsuarios {
  periodo: string;
  total_registrados: number;
  activos: number;
  inactivos: number;
  desactivadas: number;
  por_rol: Record<string, number>;
  por_semana: { semana: string; total: number }[];
  fecha_actualizacion: string;
}

interface StatsProyectos {
  periodo: string;
  total: number;
  aprobados: number;
  rechazados: number;
  pendientes: number;
  vistas_totales: number;
  por_semana: { semana: string; creados: number; aprobados: number; rechazados: number; pendientes: number }[];
  por_categoria: Record<string, number>;
  fecha_actualizacion: string;
}

interface StatsComentarios {
  periodo: string;
  total: number;
  aprobados: number;
  rechazados: number;
  pendientes: number;
  por_semana: { semana: string; revisados: number; aprobados: number; rechazados: number; pendientes: number }[];
  fecha_actualizacion: string;
}

interface StatsGeneral {
  periodo: string;
  usuarios: { total: number; activos: number; por_rol: Record<string, number> };
  proyectos: { total: number; aprobados: number; rechazados: number; pendientes: number };
  comentarios: { total: number; aprobados: number; rechazados: number; pendientes: number };
  alertas: { tipo: string; mensaje: string }[];
  fecha_actualizacion: string;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 bg-card rounded-xl border border-muted p-4 shadow-soft">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-sidebar tabular-nums">{value.toLocaleString('es-ES')}</div>
        <div className="text-xs text-sidebar/50">{label}</div>
      </div>
    </div>
  );
}

// ─── Componente de tabla semanal ──────────────────────────────────────────────
function WeeklyTable({ data, columns }: { data: Record<string, any>[]; columns: { key: string; label: string }[] }) {
  if (!data || data.length === 0) {
    return <p className="text-sidebar/40 text-sm text-center py-4">Sin datos semanales para este periodo.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-muted">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30">
            {columns.map(col => (
              <th key={col.key} className="text-left px-4 py-2.5 text-xs font-semibold text-sidebar/50 uppercase tracking-wide">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-muted">
          {data.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-muted/10 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2.5 text-sidebar tabular-nums">{row[col.key] ?? 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function AdminReportesPage() {
  // Estado del periodo
  const [periodoPreset, setPeriodoPreset] = useState<PeriodoPreset>('mes_actual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  // Estado del reporte
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>('usuarios');
  const [loading, setLoading] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Calcular fechas según preset ───────────────────────────────────────
  const getFechas = useCallback((): { fecha_inicio: string; fecha_fin: string } => {
    const hoy = new Date();
    let inicio: Date;
    let fin = new Date(hoy);

    switch (periodoPreset) {
      case 'mes_actual':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      case 'mes_anterior':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        break;
      case 'ultimos_3_meses':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
        break;
      case 'personalizado':
        return { fecha_inicio: fechaInicio, fecha_fin: fechaFin };
      default:
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    }

    return {
      fecha_inicio: inicio.toISOString().split('T')[0],
      fecha_fin: fin.toISOString().split('T')[0],
    };
  }, [periodoPreset, fechaInicio, fechaFin]);

  // ─── Generar reporte (datos en pantalla) ─────────────────────────────────
  const handleGenerarReporte = useCallback(async () => {
    const fechas = getFechas();
    if (periodoPreset === 'personalizado' && (!fechas.fecha_inicio || !fechas.fecha_fin)) {
      setError('Debes seleccionar fecha de inicio y fin para el rango personalizado.');
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const params = new URLSearchParams(fechas as any).toString();
      const response = await api.get(`/gestion/reportes/datos/${tipoReporte}?${params}`);
      setReportData(response.data?.data);
      setLastUpdated(response.data?.data?.fecha_actualizacion || new Date().toLocaleString('es-ES'));
    } catch (err: any) {
      console.error('Error al generar reporte:', err);
      setError('Error al consultar los datos del reporte. Verifica la conexión.');
    } finally {
      setLoading(false);
    }
  }, [tipoReporte, getFechas, periodoPreset]);

  // ─── Exportar PDF ────────────────────────────────────────────────────────
  const handleExportPDF = useCallback(async () => {
    const fechas = getFechas();
    setExportingPdf(true);
    try {
      const params = new URLSearchParams(fechas as any).toString();
      const response = await api.get(`/gestion/reportes/${tipoReporte}?${params}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${tipoReporte}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      setError('Error al generar el archivo PDF.');
    } finally {
      setExportingPdf(false);
    }
  }, [tipoReporte, getFechas]);

  // ─── Exportar Excel ──────────────────────────────────────────────────────
  const handleExportExcel = useCallback(async () => {
    const fechas = getFechas();
    setExportingExcel(true);
    try {
      const params = new URLSearchParams(fechas as any).toString();
      const response = await api.get(`/gestion/reportes/excel/${tipoReporte}?${params}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${tipoReporte}_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al exportar Excel:', err);
      setError('Error al generar el archivo Excel.');
    } finally {
      setExportingExcel(false);
    }
  }, [tipoReporte, getFechas]);

  // ─── Configuración de tabs ──────────────────────────────────────────────
  const tabs: { key: TipoReporte; label: string; icon: React.ElementType; color: string; bgColor: string }[] = [
    { key: 'usuarios', label: 'Usuarios', icon: Users, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
    { key: 'proyectos', label: 'Proyectos', icon: FolderGit2, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { key: 'comentarios', label: 'Moderación', icon: MessageSquare, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
    { key: 'general', label: 'General', icon: PieChart, color: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-50 dark:bg-violet-500/10' },
  ];

  const periodoOptions: { key: PeriodoPreset; label: string }[] = [
    { key: 'mes_actual', label: 'Mes actual' },
    { key: 'mes_anterior', label: 'Mes anterior' },
    { key: 'ultimos_3_meses', label: 'Últimos 3 meses' },
    { key: 'personalizado', label: 'Rango personalizado' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sidebar leading-tight">Reportes del Sistema</h1>
            <p className="text-sm text-sidebar/50 mt-0.5">
              Genera, consulta y exporta métricas de la plataforma CSER
            </p>
          </div>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-sidebar/40 self-start">
            <Clock className="w-3.5 h-3.5" />
            Última actualización: {lastUpdated}
          </div>
        )}
      </div>

      {/* ── Selector de Periodo ────────────────────────────────────────── */}
      <Card className="!p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-sidebar">Periodo de tiempo</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {periodoOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setPeriodoPreset(opt.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border
                ${periodoPreset === opt.key
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-card text-sidebar/60 border-muted hover:border-primary/30 hover:text-sidebar'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {periodoPreset === 'personalizado' && (
          <div className="flex flex-wrap items-center gap-3 mt-3 p-3 rounded-xl bg-muted/20 border border-muted">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-sidebar/60">Desde:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-muted bg-card text-sidebar text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-sidebar/60">Hasta:</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-muted bg-card text-sidebar text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        )}
      </Card>

      {/* ── Tabs de Tipo de Reporte ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tipoReporte === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setTipoReporte(tab.key); setReportData(null); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all border
                ${isActive
                  ? `${tab.bgColor} ${tab.color} border-current shadow-sm`
                  : 'bg-card text-sidebar/50 border-muted hover:bg-muted/20 hover:text-sidebar'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Botones de Acción ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <button
          id="btn-generar-reporte"
          onClick={handleGenerarReporte}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold
            hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>

        <button
          id="btn-exportar-pdf"
          onClick={handleExportPDF}
          disabled={exportingPdf || !reportData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-200 text-red-600
            font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed dark:border-red-500/30 dark:text-red-400"
        >
          <Download className={`w-4 h-4 ${exportingPdf ? 'animate-bounce' : ''}`} />
          {exportingPdf ? 'Exportando...' : 'Exportar PDF'}
        </button>

        <button
          id="btn-exportar-excel"
          onClick={handleExportExcel}
          disabled={exportingExcel || !reportData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-emerald-200 text-emerald-600
            font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed dark:border-emerald-500/30 dark:text-emerald-400"
        >
          <FileSpreadsheet className={`w-4 h-4 ${exportingExcel ? 'animate-bounce' : ''}`} />
          {exportingExcel ? 'Exportando...' : 'Exportar Excel'}
        </button>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200
          text-red-600 text-sm dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto font-semibold hover:underline">Cerrar</button>
        </div>
      )}

      {/* ── Loading Skeleton ──────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse border border-muted" />
            ))}
          </div>
          <div className="h-40 rounded-xl bg-muted/20 animate-pulse border border-muted" />
        </div>
      )}

      {/* ── Resultados del Reporte ─────────────────────────────────────── */}
      {!loading && reportData && (
        <div className="space-y-6 animate-fadeIn">

          {/* ─── REPORTE DE USUARIOS ─────────────────────────────────── */}
          {tipoReporte === 'usuarios' && (() => {
            const d = reportData as StatsUsuarios;
            return (
              <>
                <Card className="!p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-sidebar">Métricas de Usuarios — {d.periodo}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <KpiCard label="Registrados" value={d.total_registrados} color="bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400" icon={Users} />
                    <KpiCard label="Activos" value={d.activos} color="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400" icon={Users} />
                    <KpiCard label="Inactivos" value={d.inactivos} color="bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400" icon={Users} />
                    <KpiCard label="Desactivadas" value={d.desactivadas} color="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400" icon={Users} />
                  </div>
                </Card>

                {/* Distribución por rol */}
                {d.por_rol && Object.keys(d.por_rol).length > 0 && (
                  <Card className="!p-4">
                    <h3 className="text-sm font-semibold text-sidebar mb-3">Distribución por Rol</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(d.por_rol).map(([rol, total]) => (
                        <div key={rol} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/20 border border-muted">
                          <span className="text-xs font-semibold text-sidebar/50 uppercase">{rol}</span>
                          <span className="text-lg font-extrabold text-sidebar">{total}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Registros por semana */}
                <Card className="!p-4">
                  <h3 className="text-sm font-semibold text-sidebar mb-3">Registros por Semana</h3>
                  <WeeklyTable
                    data={d.por_semana}
                    columns={[
                      { key: 'semana', label: 'Semana' },
                      { key: 'total', label: 'Nuevos Registros' },
                    ]}
                  />
                </Card>
              </>
            );
          })()}

          {/* ─── REPORTE DE PROYECTOS ────────────────────────────────── */}
          {tipoReporte === 'proyectos' && (() => {
            const d = reportData as StatsProyectos;
            return (
              <>
                <Card className="!p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold text-sidebar">Métricas de Proyectos — {d.periodo}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <KpiCard label="Total Creados" value={d.total} color="bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400" icon={FolderGit2} />
                    <KpiCard label="Aprobados" value={d.aprobados} color="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400" icon={FolderGit2} />
                    <KpiCard label="Rechazados" value={d.rechazados} color="bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400" icon={FolderGit2} />
                    <KpiCard label="Pendientes" value={d.pendientes} color="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400" icon={FolderGit2} />
                    <KpiCard label="Vistas Totales" value={d.vistas_totales} color="bg-violet-50 text-violet-500 dark:bg-violet-500/10 dark:text-violet-400" icon={TrendingUp} />
                  </div>
                </Card>

                {/* Distribución por categoría */}
                {d.por_categoria && Object.keys(d.por_categoria).length > 0 && (
                  <Card className="!p-4">
                    <h3 className="text-sm font-semibold text-sidebar mb-3">Distribución por Categoría</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(d.por_categoria).map(([cat, total]) => (
                        <div key={cat} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25">
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{cat}</span>
                          <span className="text-lg font-extrabold text-emerald-800 dark:text-emerald-300">{total}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Por semana */}
                <Card className="!p-4">
                  <h3 className="text-sm font-semibold text-sidebar mb-3">Proyectos por Semana</h3>
                  <WeeklyTable
                    data={d.por_semana}
                    columns={[
                      { key: 'semana', label: 'Semana' },
                      { key: 'creados', label: 'Creados' },
                      { key: 'aprobados', label: 'Aprobados' },
                      { key: 'rechazados', label: 'Rechazados' },
                      { key: 'pendientes', label: 'Pendientes' },
                    ]}
                  />
                </Card>
              </>
            );
          })()}

          {/* ─── REPORTE DE MODERACIÓN ───────────────────────────────── */}
          {tipoReporte === 'comentarios' && (() => {
            const d = reportData as StatsComentarios;
            return (
              <>
                <Card className="!p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-sidebar">Métricas de Moderación — {d.periodo}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <KpiCard label="Total Revisados" value={d.total} color="bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400" icon={MessageSquare} />
                    <KpiCard label="Aprobados" value={d.aprobados} color="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400" icon={MessageSquare} />
                    <KpiCard label="Rechazados" value={d.rechazados} color="bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400" icon={MessageSquare} />
                    <KpiCard label="Pendientes" value={d.pendientes} color="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400" icon={MessageSquare} />
                  </div>
                </Card>

                {/* Por semana */}
                <Card className="!p-4">
                  <h3 className="text-sm font-semibold text-sidebar mb-3">Moderación por Semana</h3>
                  <WeeklyTable
                    data={d.por_semana}
                    columns={[
                      { key: 'semana', label: 'Semana' },
                      { key: 'revisados', label: 'Revisados' },
                      { key: 'aprobados', label: 'Aprobados' },
                      { key: 'rechazados', label: 'Rechazados' },
                      { key: 'pendientes', label: 'Pendientes' },
                    ]}
                  />
                </Card>
              </>
            );
          })()}

          {/* ─── REPORTE GENERAL ─────────────────────────────────────── */}
          {tipoReporte === 'general' && (() => {
            const d = reportData as StatsGeneral;
            return (
              <>
                {/* Resumen ejecutivo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Usuarios */}
                  <Card className="!p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-blue-500" />
                      <h3 className="text-sm font-semibold text-sidebar">Usuarios</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Total registrados</span>
                        <span className="text-sm font-bold text-sidebar">{d.usuarios.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Activos</span>
                        <span className="text-sm font-bold text-emerald-600">{d.usuarios.activos}</span>
                      </div>
                      {d.usuarios.por_rol && Object.entries(d.usuarios.por_rol).map(([rol, total]) => (
                        <div key={rol} className="flex justify-between">
                          <span className="text-sm text-sidebar/60">Rol: {rol}</span>
                          <span className="text-sm font-bold text-sidebar">{total}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Proyectos */}
                  <Card className="!p-4 border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-2 mb-3">
                      <FolderGit2 className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-sm font-semibold text-sidebar">Proyectos</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Total</span>
                        <span className="text-sm font-bold text-sidebar">{d.proyectos.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Aprobados</span>
                        <span className="text-sm font-bold text-emerald-600">{d.proyectos.aprobados}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Rechazados</span>
                        <span className="text-sm font-bold text-red-600">{d.proyectos.rechazados}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Pendientes</span>
                        <span className="text-sm font-bold text-amber-600">{d.proyectos.pendientes}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Comentarios */}
                  <Card className="!p-4 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-sidebar">Moderación</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Total</span>
                        <span className="text-sm font-bold text-sidebar">{d.comentarios.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Aprobados</span>
                        <span className="text-sm font-bold text-emerald-600">{d.comentarios.aprobados}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Rechazados</span>
                        <span className="text-sm font-bold text-red-600">{d.comentarios.rechazados}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-sidebar/60">Pendientes</span>
                        <span className="text-sm font-bold text-amber-600">{d.comentarios.pendientes}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Alertas activas */}
                {d.alertas && d.alertas.length > 0 && (
                  <Card className="!p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-sidebar">Alertas Activas del Sistema</h3>
                    </div>
                    <div className="space-y-2">
                      {d.alertas.map((alerta, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                            ${alerta.tipo === 'warning'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25'
                              : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25'
                            }`}
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          {alerta.mensaje}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ── Estado vacío ──────────────────────────────────────────────── */}
      {!loading && !reportData && !error && (
        <Card className="!p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary/60" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sidebar/70">Selecciona un periodo y genera tu reporte</h3>
              <p className="text-sm text-sidebar/40 mt-1">
                Elige el tipo de reporte, ajusta el periodo y haz clic en "Generar Reporte" para ver las métricas.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}