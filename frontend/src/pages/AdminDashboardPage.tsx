import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, FolderGit2, MessageSquare, Tag,
  CheckCircle2, LayoutDashboard, ArrowRight, RefreshCw,
  AlertCircle, ShieldAlert, UserX,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import api from '../utils/api';

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface RecentUser {
  id: number;
  nombre: string;
  email: string;
  profesion?: string;
  especialidad?: string;
  rol: 'admin' | 'usuario' | 'moderador';
  activo: number | boolean;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_registro?: string;
  username: string;
}

interface RecentProject {
  id: number;
  titulo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  usuario?: { nombre: string; username?: string };
  created_at?: string;
}

interface DashboardData {
  kpis: {
    usuariosActivos: number;    // CA2
    totalProyectos: number;     // CA2
    totalComentarios: number;   // CA2
    totalCategorias: number;    // CA2
  };
  alertas: {
    proyectosPendientes: number;   // CA3
    comentariosPendientes: number; // CA3
    usuariosPendientes: number;    // CA3
  };
  recentUsers: RecentUser[];    // CA5
  recentProjects: RecentProject[]; // CA5
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  valueColor?: string;
  loading: boolean;
}
function KpiCard({ label, value, icon: Icon, iconColor, valueColor = 'text-sidebar', loading }: KpiCardProps) {
  return (
    <Card className="flex flex-col gap-3 !p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        {loading
          ? <div className="h-9 w-16 rounded-lg bg-muted animate-pulse" />
          : <span className={`text-4xl font-bold tabular-nums leading-none ${valueColor}`}>{value.toLocaleString('es-ES')}</span>
        }
      </div>
      <p className="text-sm text-sidebar/60 leading-tight">{label}</p>
    </Card>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 px-5 py-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="flex-1 h-3.5 bg-muted rounded" />
          <div className="w-28 h-3.5 bg-muted rounded" />
          <div className="w-20 h-3.5 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function EstadoToggle({ activo }: { activo: number | boolean }) {
  return (
    <div className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${activo ? 'bg-green-500' : 'bg-gray-300'}`}>
      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${activo ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    aprobado:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    pendiente: 'bg-amber-100  text-amber-700  dark:bg-amber-500/15  dark:text-amber-400',
    rechazado: 'bg-red-100    text-red-700    dark:bg-red-500/15    dark:text-red-400',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[estado] ?? 'bg-gray-100 text-gray-600'}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [data, setData]               = useState<DashboardData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // CA7: doble verificación de rol
  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/dashboard', { replace: true });
  }, [isAdmin, authLoading, navigate]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await api.get('/gestion/dashboard/stats');
      const stats = statsRes.data?.data || {};

      setData({
        kpis: {
          usuariosActivos:  stats.usuarios_activos || 0,
          totalProyectos:   stats.total_proyectos || 0,
          totalComentarios: stats.total_comentarios || 0,
          totalCategorias:  stats.total_categorias || 0,
        },
        alertas: {
          proyectosPendientes:   stats.pendientes_proyectos || 0,
          comentariosPendientes: stats.pendientes_comentarios || 0,
          usuariosPendientes:    stats.pendientes_usuarios || 0,
        },
        recentUsers:    stats.ultimos_usuarios || [],
        recentProjects: stats.ultimos_proyectos || [],
      });
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError('No se pudieron cargar los datos. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) fetchDashboardData();
  }, [authLoading, isAdmin, fetchDashboardData]);

  if (authLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAdmin) return null;

  const kpis    = data?.kpis    ?? { usuariosActivos: 0, totalProyectos: 0, totalComentarios: 0, totalCategorias: 0 };
  const alertas = data?.alertas ?? { proyectosPendientes: 0, comentariosPendientes: 0, usuariosPendientes: 0 };
  const hayAlertas = alertas.proyectosPendientes > 0 || alertas.comentariosPendientes > 0 || alertas.usuariosPendientes > 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sidebar leading-tight">Panel de Administración</h1>
            <p className="text-sm text-sidebar/50 mt-0.5">Control y moderación de la plataforma CSER Portafolios</p>
          </div>
        </div>
        <button
          id="btn-refresh-dashboard"
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-muted
            text-sidebar/60 hover:bg-muted/30 hover:text-sidebar transition-all text-sm font-medium
            disabled:opacity-40 disabled:cursor-not-allowed self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {lastUpdated
            ? lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            : 'Actualizar'}
        </button>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200
          text-red-600 text-sm dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="ml-auto underline font-semibold">Reintentar</button>
        </div>
      )}

      {/* ── KPIs (CA2) — responsive: 1→2→4 columnas ────────────────────────
           375px: 1 col | sm(640px): 2 cols | lg(1024px): 4 cols            */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Usuarios Activos"
          value={kpis.usuariosActivos}
          icon={Users}
          iconColor="bg-teal-50 text-teal-500 dark:bg-teal-500/10 dark:text-teal-400"
          loading={loading}
        />
        <KpiCard
          label="Total Proyectos en el Sistema"
          value={kpis.totalProyectos}
          icon={FolderGit2}
          iconColor="bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400"
          loading={loading}
        />
        <KpiCard
          label="Total Comentarios"
          value={kpis.totalComentarios}
          icon={MessageSquare}
          iconColor="bg-violet-50 text-violet-500 dark:bg-violet-500/10 dark:text-violet-400"
          loading={loading}
        />
        <KpiCard
          label="Total Categorías"
          value={kpis.totalCategorias}
          icon={Tag}
          iconColor="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
          loading={loading}
        />
      </div>

      {/* ── Alertas (CA3 + CA4) ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="h-16 rounded-2xl bg-muted/30 animate-pulse border border-muted" />
      ) : hayAlertas ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {alertas.proyectosPendientes > 0 && (
            <Link to="/gestion/aprobaciones" id="alert-proyectos"
              className="group flex items-center justify-between gap-4 p-4 rounded-2xl
                bg-amber-50 border border-amber-200 hover:border-amber-400
                dark:bg-amber-500/10 dark:border-amber-500/25 dark:hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Proyectos Pendientes</p>
                  <p className="text-amber-600/80 dark:text-amber-400/70 text-xs">
                    {alertas.proyectosPendientes} proyecto{alertas.proyectosPendientes !== 1 ? 's' : ''} por aprobar
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          )}

          {alertas.comentariosPendientes > 0 && (
            <Link to="/gestion/moderacion" id="alert-comentarios"
              className="group flex items-center justify-between gap-4 p-4 rounded-2xl
                bg-blue-50 border border-blue-200 hover:border-blue-400
                dark:bg-blue-500/10 dark:border-blue-500/25 dark:hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Comentarios en Revisión</p>
                  <p className="text-blue-600/80 dark:text-blue-400/70 text-xs">
                    {alertas.comentariosPendientes} comentario{alertas.comentariosPendientes !== 1 ? 's' : ''} por moderar
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          )}

          {alertas.usuariosPendientes > 0 && (
            <Link to="/gestion/usuarios" id="alert-usuarios"
              className="group flex items-center justify-between gap-4 p-4 rounded-2xl
                bg-violet-50 border border-violet-200 hover:border-violet-400
                dark:bg-violet-500/10 dark:border-violet-500/25 dark:hover:border-violet-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <UserX className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-violet-800 dark:text-violet-300 text-sm">Usuarios Pendientes</p>
                  <p className="text-violet-600/80 dark:text-violet-400/70 text-xs">
                    {alertas.usuariosPendientes} usuario{alertas.usuariosPendientes !== 1 ? 's' : ''} sin revisar
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          )}
        </div>
      ) : (
        /* CA4: Mensaje "Todo al día" */
        <div className="flex items-center gap-3 p-4 rounded-2xl
          bg-emerald-50 border border-emerald-200
          dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Todo al día — no hay elementos pendientes de revisión.</span>
        </div>
      )}

      {/* ── Tablas (CA5) ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Últimas 5 altas de Usuarios */}
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted">
            <h2 className="text-base font-semibold text-sidebar">Últimos Usuarios</h2>
            <Link to="/gestion/usuarios" id="link-todos-usuarios"
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {!loading && (data?.recentUsers.length ?? 0) > 0 && (
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-x-3 px-5 py-2 border-b border-muted bg-muted/20">
              {['Nombre', 'Correo', 'Profesión', 'Estado'].map(col => (
                <span key={col} className="text-xs font-semibold text-sidebar/50 uppercase tracking-wide">{col}</span>
              ))}
            </div>
          )}

          {loading ? <TableSkeleton rows={5} />
            : (data?.recentUsers.length ?? 0) === 0
              ? <p className="text-center text-sidebar/40 text-sm py-10">Sin usuarios registrados.</p>
              : (
                <ul className="divide-y divide-muted">
                  {data!.recentUsers.map(user => (
                    <li key={user.id}
                      className="grid grid-cols-[1fr_1fr_1fr_auto] gap-x-3 items-center px-5 py-3 hover:bg-muted/10 transition-colors">
                      <span className="text-sm font-medium text-sidebar truncate">{user.nombre}</span>
                      <span className="text-sm text-sidebar/60 truncate">{user.email}</span>
                      <span className="text-sm text-sidebar/60 truncate">
                        {user.profesion ?? user.especialidad ?? (user.rol === 'admin' ? 'Administrador' : '—')}
                      </span>
                      <EstadoToggle activo={user.activo} />
                    </li>
                  ))}
                </ul>
              )}
        </Card>

        {/* Últimas 5 altas de Proyectos (CA5: cualquier estado) */}
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted">
            <h2 className="text-base font-semibold text-sidebar">Últimas Altas de Proyectos</h2>
            <Link to="/gestion/aprobaciones" id="link-todos-proyectos"
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {!loading && (data?.recentProjects.length ?? 0) > 0 && (
            <div className="grid grid-cols-[1fr_1fr_auto] gap-x-3 px-5 py-2 border-b border-muted bg-muted/20">
              {['Título', 'Autor', 'Estado'].map(col => (
                <span key={col} className="text-xs font-semibold text-sidebar/50 uppercase tracking-wide">{col}</span>
              ))}
            </div>
          )}

          {loading ? <TableSkeleton rows={5} />
            : (data?.recentProjects.length ?? 0) === 0
              ? (
                <div className="flex flex-col items-center justify-center gap-3 py-14">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-sm text-sidebar/50">Sin proyectos registrados aún.</p>
                </div>
              ) : (
                <ul className="divide-y divide-muted">
                  {data!.recentProjects.map(project => (
                    <li key={project.id}
                      className="grid grid-cols-[1fr_1fr_auto] gap-x-3 items-center px-5 py-3 hover:bg-muted/10 transition-colors">
                      <span className="text-sm font-medium text-sidebar truncate">{project.titulo}</span>
                      <span className="text-sm text-sidebar/60 truncate">{project.usuario?.nombre ?? '—'}</span>
                      <EstadoBadge estado={project.estado} />
                    </li>
                  ))}
                </ul>
              )}
        </Card>
      </div>

      {/* ── Accesos Rápidos (CA6) ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-sidebar/50 uppercase tracking-widest mb-3">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/gestion/usuarios',     label: 'Usuarios',     icon: Users,        color: 'text-teal-600   bg-teal-50   border-teal-200   hover:border-teal-400   dark:bg-teal-500/10   dark:border-teal-500/25   dark:text-teal-400'   },
            { to: '/gestion/aprobaciones', label: 'Aprobaciones', icon: ShieldAlert,  color: 'text-amber-600  bg-amber-50  border-amber-200  hover:border-amber-400  dark:bg-amber-500/10  dark:border-amber-500/25  dark:text-amber-400'  },
            { to: '/gestion/moderacion',   label: 'Comentarios',  icon: MessageSquare,color: 'text-blue-600   bg-blue-50   border-blue-200   hover:border-blue-400   dark:bg-blue-500/10   dark:border-blue-500/25   dark:text-blue-400'   },
            { to: '/gestion/reportes',     label: 'Reportes',     icon: FolderGit2,   color: 'text-violet-600 bg-violet-50 border-violet-200 hover:border-violet-400 dark:bg-violet-500/10 dark:border-violet-500/25 dark:text-violet-400' },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all
                hover:scale-[1.03] hover:shadow-md ${color}`}>
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}