import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { FolderGit2, Eye, Plus, Edit, ArrowRight, MessageSquare, CheckCircle2, XCircle, Clock, Briefcase, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useVisitas } from '../hooks/useVisitas';
import { useComentariosRecientes } from '../hooks/useComentariosRecientes';
import { useExperience } from '../hooks/useExperience';
import { useUserDashboardStats } from '../hooks/useUserDashboardStats';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error, deleteProject } = useProjects();
  const { visitasEsteMes, visitantesRecientes, loading: loadingVisitas } = useVisitas();
  const { comentarios, loading: loadingComentarios } = useComentariosRecientes();
  const { experiences } = useExperience();
  const { stats: dashboardStats, loading: loadingStats } = useUserDashboardStats();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const completitudItems = [
    { label: 'Foto de perfil',       done: !!user?.foto },
    { label: 'Profesión',            done: !!user?.profesion },
    { label: 'Especialidad',         done: !!user?.especialidad },
    { label: 'Biografía',            done: !!user?.biografia },
    { label: 'Ubicación',            done: !!user?.ubicacion },
    { label: 'Teléfono',             done: !!user?.telefono },
    { label: 'Red social',           done: !!(user?.linkedin || user?.github_perfil || user?.sitio_web) },
    { label: 'Proyecto publicado',   done: projects.some((p) => p.estado === 'aprobado') },
    { label: 'Experiencia laboral',  done: experiences.some((e) => e.tipo === 'laboral') },
    { label: 'Formación académica',  done: experiences.some((e) => e.tipo === 'academica') },
  ];
  const completitudPct = Math.round(
    (completitudItems.filter((i) => i.done).length / completitudItems.length) * 100
  );

  const stats = [
    {
      label: 'Proyectos Publicados',
      value: dashboardStats?.proyectos_publicados || projects.filter((p) => p.estado === 'aprobado').length,
      icon: FolderGit2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Visitas a mi perfil',
      value: dashboardStats?.visitas_perfil || visitasEsteMes,
      icon: Eye,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Comentarios Recibidos',
      value: dashboardStats?.comentarios_recibidos || 0,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Apariciones en Búsquedas',
      value: dashboardStats?.apariciones_busqueda || 0,
      icon: Eye,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const recentProjects = projects.slice(0, 5);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteProject(pendingDeleteId);
    } catch (err: any) {
      alert("Error al eliminar: " + (err.response?.data?.message || err.message));
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header aligned perfectly with the system margins */}
      <header className="page-header">
        <div>
          <h1 className="page-title">
            Hola, {user?.nombre?.split(' ')[0]}
          </h1>
          <p className="page-subtitle">
            Gestiona tu portafolio profesional y mantén tu perfil actualizado
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary font-bold border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg">
          <Clock className="w-5 h-5" />
          <span>{currentTime}</span>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-all duration-200 !p-5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                 <span className="text-2xl font-bold text-sidebar block leading-none mb-1">
                   {stat.value}
                 </span>
                 <p className="text-xs font-semibold text-sidebar/70">
                   {stat.label}
                 </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Banners de prioridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Proyectos Pendientes */}
        <Link to="/dashboard/proyectos" className="bg-white border border-sidebar/10 p-4 rounded-xl flex items-center justify-between hover:border-sidebar/30 hover:shadow-sm transition-all group">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-sidebar/5 rounded-lg text-sidebar/60 group-hover:bg-sidebar/10 group-hover:text-sidebar transition-colors">
               <AlertCircle className="w-5 h-5" />
             </div>
             <div>
               <p className="text-sm font-bold text-sidebar transition-colors">Proyectos Pendientes</p>
               <p className="text-xs text-sidebar/60">{projects.filter(p => p.estado === 'pendiente').length} proyecto(s) en revisión</p>
             </div>
           </div>
           <ArrowRight className="w-4 h-4 text-sidebar/40 group-hover:text-sidebar transition-colors" />
        </Link>
        
        {/* Comentarios */}
        <Link to="/dashboard/proyectos" className="bg-[#f0f4ff] border border-blue-100 p-4 rounded-xl flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all group">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100/70 rounded-lg text-blue-500">
               <MessageSquare className="w-5 h-5" />
             </div>
             <div>
               <p className="text-sm font-bold text-blue-900">Comentarios por Responder</p>
               <p className="text-xs text-blue-700">{dashboardStats?.comentarios_por_responder || 0} comentario(s) nuevo(s)</p>
             </div>
           </div>
           <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
        </Link>

        {/* Reclutadores */}
        <Link to="/dashboard/reclutadores" className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition-all group">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-100/80 rounded-lg text-emerald-600">
               <Briefcase className="w-5 h-5" />
             </div>
             <div>
               <p className="text-sm font-bold text-emerald-900">Mensajes de Reclutadores</p>
               <p className="text-xs text-emerald-700">{dashboardStats?.mensajes_reclutadores_nuevos || 0} mensaje(s) sin leer</p>
             </div>
           </div>
           <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
        </Link>
      </div>

      {/* Main Layout: 2 Rows Stacked */}
      <div className="space-y-6">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Projects Table Card */}
          <Card className="!p-0 overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-muted bg-white dark:bg-card">
              <h2 className="text-lg font-bold text-sidebar">Mis Proyectos Recientes</h2>
              <Link to="/dashboard/proyectos">
                <Button variant="ghost" size="sm" className="gap-1 text-primary text-sm font-semibold hover:bg-primary/5">
                  Ver todos <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {recentProjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-muted bg-muted/20">
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Proyecto</th>
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Tecnologías</th>
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Estado</th>
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted bg-white dark:bg-card">
                    {recentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-muted">
                              {project.imagen_url ? (
                                <img
                                  src={project.imagen_url}
                                  alt={project.titulo}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <FolderGit2 className="w-6 h-6 text-sidebar/20" />
                              )}
                            </div>
                            <div className="max-w-[150px] sm:max-w-xs">
                              <h3 className="font-semibold text-sidebar text-base line-clamp-1">{project.titulo}</h3>
                              <p className="text-sm text-sidebar/50 line-clamp-1 mt-0.5">{project.descripcion}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {project.tecnologias.slice(0, 2).map((tech, index) => (
                              <span key={index} className="inline-block bg-primary/5 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium">
                                {tech}
                              </span>
                            ))}
                            {project.tecnologias.length > 2 && (
                              <span className="text-xs text-sidebar/50 ml-1">
                                +{project.tecnologias.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant={
                              project.estado === 'aprobado' ? 'success' :
                              project.estado === 'pendiente' ? 'warning' : 'destructive'
                            }
                            size="md"
                          >
                            {project.estado}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to="/dashboard/proyectos" state={{ openEditModal: true, editProjectId: project.id }}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 !p-0" title="Editar">
                                <Edit className="w-4.5 h-4.5 text-sidebar/60 hover:text-primary" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 !p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setPendingDeleteId(project.id)}
                              title="Eliminar"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-card">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FolderGit2 className="w-10 h-10 text-sidebar/30" />
                </div>
                <h3 className="text-xl font-semibold text-sidebar mb-1">
                  No tienes proyectos aún
                </h3>
                <p className="text-sm text-sidebar/60 mb-6 max-w-sm mx-auto">
                  Comienza agregando tu primer proyecto para mostrar tu trabajo
                </p>
                <Link to="/dashboard/proyectos" state={{ openCreateModal: true }}>
                  <Button variant="primary" size="md" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Crear Mi Primer Proyecto
                  </Button>
                </Link>
              </div>
            )}
            <div className="flex-1 bg-white dark:bg-card"></div>
          </Card>

          {/* Reclutadores Card */}
          <Card className="!p-0 overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-muted bg-white dark:bg-card">
              <h2 className="text-lg font-bold text-sidebar">Solicitudes de Reclutadores</h2>
              <Link to="/dashboard/reclutadores">
                <Button variant="ghost" size="sm" className="gap-1 text-primary text-sm font-semibold hover:bg-primary/5">
                  Ver todos <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {loadingStats ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : dashboardStats?.ultimas_ofertas?.length > 0 ? (
              <div className="p-4 space-y-3 flex-1 bg-white dark:bg-card">
                {dashboardStats.ultimas_ofertas.map((of: any) => {
                  const isNew = of.estado === 'nuevo';
                  return (
                    <div key={of.id} className={`border rounded-xl p-4 transition-colors flex items-center justify-between group ${isNew ? 'bg-blue-50/50 border-blue-300' : 'border-muted hover:border-primary/50'}`}>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {of.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-sidebar flex items-center gap-2">
                                {of.titulo_puesto}
                                {isNew && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                            </h3>
                            <p className="text-xs text-sidebar/60">{of.empresa} • {of.modalidad} • {of.created_at}</p>
                          </div>
                      </div>
                      <Link to="/dashboard/reclutadores">
                        <Button variant="ghost" size="sm" className="font-semibold text-primary hover:bg-primary/5">Ver</Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-card flex-1 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-sidebar/30" />
                </div>
                <h3 className="text-xl font-semibold text-sidebar mb-1">
                  Aún no hay ofertas
                </h3>
                <p className="text-sm text-sidebar/60 max-w-sm mx-auto">
                  Las ofertas de trabajo de reclutadores aparecerán aquí
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Comments Card */}
          <Card className="!p-0 overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-muted bg-white dark:bg-card">
              <h2 className="text-lg font-bold text-sidebar">Últimos Comentarios a mis Proyectos</h2>
              <Link to="/dashboard/proyectos">
                <Button variant="ghost" size="sm" className="gap-1 text-primary text-sm font-semibold hover:bg-primary/5">
                  Mis Proyectos <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {loadingComentarios ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : comentarios.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-muted bg-muted/20">
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Autor</th>
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Comentario</th>
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Proyecto</th>
                      <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted bg-white dark:bg-card">
                    {comentarios.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-4">
                          {c.autor ? (
                            <Link to={`/portfolio/${c.autor.username}`} className="flex items-center gap-2 group/author">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                {c.autor.avatarLetter}
                              </div>
                              <span className="text-sm font-semibold text-sidebar group-hover/author:text-primary line-clamp-1 transition-colors">
                                {c.autor.nombre}
                              </span>
                            </Link>
                          ) : (
                            <span className="text-sm text-sidebar/40 italic">Anónimo</span>
                          )}
                        </td>
                        <td className="px-5 py-4 max-w-[180px]">
                          <p className="text-sm text-sidebar/70 line-clamp-2">{c.contenido}</p>
                          <span className="text-xs text-sidebar/40">{c.tiempo}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-sidebar/70 line-clamp-1">
                            {c.proyecto.titulo}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link to={`/proyecto/${c.proyecto.id}`}>
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 font-medium">
                              Responder
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-card">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-sidebar/30" />
                </div>
                <h3 className="text-xl font-semibold text-sidebar mb-1">
                  Aún no hay comentarios
                </h3>
                <p className="text-sm text-sidebar/60 max-w-sm mx-auto">
                  Cuando alguien comente en tus proyectos, aparecerán aquí
                </p>
              </div>
            )}
            <div className="flex-1 bg-white dark:bg-card"></div>
          </Card>

          {/* Profile Completeness Card */}
          <Card className="hover:shadow-md transition-all duration-200 h-full flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-sidebar">Completitud de tu Perfil</h2>
              <span className="text-3xl font-bold text-sidebar">{completitudPct}%</span>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-5">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${completitudPct}%` }}
              />
            </div>

            <ul className="space-y-2">
              {completitudItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-sidebar/25 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? 'text-sidebar/70' : 'text-sidebar/40'}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            {completitudPct < 100 && (
              <div className="mt-5 pt-4 border-t border-muted mt-auto">
                <Link to="/dashboard/perfil">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-primary text-sm font-semibold hover:bg-primary/5 px-0">
                    Completar mi perfil <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>

      <ConfirmModal
        show={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
        message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
      />
    </div>
  );
}
