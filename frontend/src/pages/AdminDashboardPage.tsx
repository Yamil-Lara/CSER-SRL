import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, FolderGit2, UserPlus, AlertCircle,
  CheckCircle2, LayoutDashboard, ArrowRight, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import api from '../utils/api';

// ─── Interfaces (DashboardData) ───────────────────────────────────────────────
interface RecentUser {
  id: number;
  nombre: string;
  email: string;
  profesion?: string;
  especialidad?: string;
  rol: 'admin' | 'usuario' | 'moderador';
  activo: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_registro?: string;
  username: string;
}

interface PendingProject {
  id: number;
  titulo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  usuario?: { nombre: string; username?: string };
  created_at?: string;
}

interface DashboardData {
  kpis: {
    totalUsuarios: number;
    totalProyectos: number;
    nuevosHoy: number;
    pendientesRevision: number;
  };
  recentUsers: RecentUser[];
  pendingProjects: PendingProject[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

// ─── Sub-componente: KPI Card (estilo mockup) ─────────────────────────────────
interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;   // clases de color del ícono
  valueColor?: string; // clases de color del número (por defecto oscuro)
  loading: boolean;
}

function KpiCard({ label, value, icon: Icon, iconColor, valueColor = 'text-gray-800 dark:text-white', loading }: KpiCardProps) {
  return (
    <Card className="flex flex-col gap-3 !p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        {loading ? (
          <div className="h-9 w-16 rounded-lg bg-muted animate-pulse" />
        ) : (
          <span className={`text-4xl font-bold tabular-nums leading-none ${valueColor}`}>
            {value.toLocaleString('es-ES')}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-tight">{label}</p>
    </Card>
  );
}

// ─── Sub-componente: skeleton de tabla ───────────────────────────────────────
function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="flex-1 h-3.5 bg-muted rounded-md" />
          <div className="w-28 h-3.5 bg-muted rounded-md" />
          <div className="w-24 h-3.5 bg-muted rounded-md" />
          <div className="w-12 h-6 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Sub-componente: toggle visual de estado (solo lectura) ───────────────────
function EstadoToggle({ activo }: { activo: number }) {
  const on = activo === 1;
  return (
    <div
      className={`relative inline-flex items-center w-10 h-6 rounded-full transition-colors duration-200 ${
        on ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
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

  // ── Criterio 7: doble verificación de rol ────────────────────────────────
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  // ── Fetch de datos ────────────────────────────────────────────────────────
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, projectsRes, commentsRes] = await Promise.all([
        api.get('/gestion/usuarios'),
        api.get('/gestion/proyectos'),
        api.get('/gestion/comentarios/pendientes'),
      ]);

      // Usuarios
      const rawUsers: RecentUser[] =
        usersRes.data?.data?.data ?? usersRes.data?.data ?? [];

      // Proyectos
      const projectPayload = projectsRes.data?.data ?? {};
      const rawProjects: PendingProject[] =
        projectPayload.proyectos ??
        projectPayload.data ??
        (Array.isArray(projectPayload) ? projectPayload : []);

      const projectStats = projectPayload.stats ?? {};

      // Comentarios pendientes
      const allComments: any[] = commentsRes.data?.data ?? [];
      const pendingComments = allComments.filter((c: any) => c.aprobado === 0).length;

      // Proyectos pendientes
      const pendingProjectsCount: number =
        projectStats.pendientes ??
        rawProjects.filter((p) => p.estado === 'pendiente').length;

      const nuevosHoy = rawUsers.filter((u) => isToday(u.fecha_registro)).length;

      setData({
        kpis: {
          totalUsuarios: rawUsers.length,
          totalProyectos: rawProjects.length,
          nuevosHoy,
          pendientesRevision: pendingProjectsCount + pendingComments,
        },
        recentUsers: rawUsers.slice(0, 5),
        pendingProjects: rawProjects.filter((p) => p.estado === 'pendiente').slice(0, 5),
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
    if (!authLoading && isAdmin) {
      fetchDashboardData();
    }
  }, [authLoading, isAdmin, fetchDashboardData]);

  // ── Guards ────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return null;

  const kpis = data?.kpis ?? { totalUsuarios: 0, totalProyectos: 0, nuevosHoy: 0, pendientesRevision: 0 };
  const hayPendientes = (data?.pendingProjects.length ?? 0) > 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sidebar leading-tight">
              Panel de Administración
            </h1>
            <p className="text-sm text-sidebar/50 mt-0.5">
              Control y moderación de la plataforma CSER Portafolios
            </p>
          </div>
        </div>

        <button
          id="btn-refresh-dashboard"
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-muted
            text-sidebar/60 hover:bg-muted/30 hover:text-sidebar transition-all text-sm
            font-medium disabled:opacity-40 disabled:cursor-not-allowed self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {lastUpdated
            ? lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            : 'Actualizar'}
        </button>
      </div>

      {/* ── Banner de error ──────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200
          text-red-600 text-sm dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchDashboardData}
            className="ml-auto underline hover:no-underline font-semibold"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── KPI Cards ─────────────────────────────────────────────────────────
           Responsive: 1 col → 2 cols (sm) → 4 cols (lg)                     */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Usuarios Registrados"
          value={kpis.totalUsuarios}
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
          label="Nuevos registros hoy"
          value={kpis.nuevosHoy}
          icon={UserPlus}
          iconColor="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
          loading={loading}
        />
        <KpiCard
          label="Pendientes de Revisión"
          value={kpis.pendientesRevision}
          icon={AlertCircle}
          iconColor="bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
          valueColor="text-red-500"
          loading={loading}
        />
      </div>

      {/* ── Sección inferior: Usuarios | Proyectos por Aprobar ────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Tabla: Últimos Usuarios ──────────────────────────────────────── */}
        <Card className="!p-0 overflow-hidden">
          {/* Cabecera */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted">
            <h2 className="text-base font-semibold text-sidebar">Últimos Usuarios</h2>
            <Link
              to="/gestion/usuarios"
              id="link-ver-todos-usuarios"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Encabezados de columna */}
          {!loading && (data?.recentUsers.length ?? 0) > 0 && (
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-x-4 px-5 py-2
              border-b border-muted bg-muted/20">
              {['Nombre', 'Correo', 'Profesión', 'Estado'].map(col => (
                <span key={col} className="text-xs font-semibold text-sidebar/50 uppercase tracking-wide">
                  {col}
                </span>
              ))}
            </div>
          )}

          {/* Filas */}
          {loading ? (
            <TableSkeleton rows={5} />
          ) : (data?.recentUsers.length ?? 0) === 0 ? (
            <p className="text-center text-sidebar/40 text-sm py-10">
              Sin usuarios registrados.
            </p>
          ) : (
            <ul className="divide-y divide-muted">
              {data!.recentUsers.map(user => (
                <li
                  key={user.id}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-x-4 items-center
                    px-5 py-3 hover:bg-muted/10 transition-colors"
                >
                  <span className="text-sm font-medium text-sidebar truncate">{user.nombre}</span>
                  <span className="text-sm text-sidebar/60 truncate">{user.email}</span>
                  <span className="text-sm text-sidebar/60 truncate">
                    {user.profesion ?? user.especialidad ?? (user.rol === 'admin' ? 'Administrador del Sistema' : '—')}
                  </span>
                  <EstadoToggle activo={user.activo} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ── Panel: Proyectos por Aprobar ─────────────────────────────────── */}
        <Card className="!p-0 overflow-hidden">
          {/* Cabecera */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted">
            <h2 className="text-base font-semibold text-sidebar">Proyectos por Aprobar</h2>
            {hayPendientes && (
              <Link
                to="/gestion/aprobaciones"
                id="link-ir-aprobaciones"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Contenido */}
          {loading ? (
            <TableSkeleton rows={3} />
          ) : !hayPendientes ? (
            /* Estado vacío: igual al mockup */
            <div className="flex flex-col items-center justify-center gap-3 py-14 px-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10
                flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="text-sm text-sidebar/50 text-center leading-relaxed">
                No hay proyectos pendientes de revisión
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-muted">
              {data!.pendingProjects.map(project => (
                <li
                  key={project.id}
                  className="flex items-center gap-3 px-5 py-3
                    hover:bg-muted/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10
                    flex items-center justify-center flex-shrink-0">
                    <FolderGit2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar truncate">
                      {project.titulo}
                    </p>
                    <p className="text-xs text-sidebar/50 truncate">
                      {project.usuario?.nombre ?? 'Usuario desconocido'}
                    </p>
                  </div>
                  <Link
                    to="/gestion/aprobaciones"
                    className="flex-shrink-0 text-xs font-semibold text-amber-500
                      hover:text-amber-600 flex items-center gap-1 transition-colors"
                  >
                    Revisar <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

      </div>
    </div>
  );
}