import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { FolderGit2, Eye, Plus, Edit, ArrowRight, MessageSquare, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useVisitas } from '../hooks/useVisitas';
import { useComentariosRecientes } from '../hooks/useComentariosRecientes';
import { useExperience } from '../hooks/useExperience';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error, deleteProject } = useProjects();
  const { visitasEsteMes, visitantesRecientes, loading: loadingVisitas } = useVisitas();
  const { comentarios, loading: loadingComentarios } = useComentariosRecientes();
  const { experiences } = useExperience();

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
      value: projects.filter((p) => p.estado === 'aprobado').length,
      icon: FolderGit2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Visitas a mi perfil este mes',
      value: visitasEsteMes,
      icon: Eye,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
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
        <Link to="/dashboard/proyectos" state={{ openCreateModal: true }}>
          <Button variant="primary" className="gap-2 shadow-sm">
            <Plus className="w-5 h-5" />
            Añadir Nuevo Proyecto
          </Button>
        </Link>
      </header>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid - 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-4xl font-bold text-sidebar">
                {stat.value}
              </span>
            </div>
            <p className="text-base font-semibold text-sidebar/70">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Main Grid: Projects Table & Visitors Table side-by-side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Projects Table Card */}
        <Card className="!p-0 overflow-hidden hover:shadow-md transition-all duration-200">
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
        </Card>

        {/* Profile Visitors Table Card */}
        <Card className="!p-0 overflow-hidden hover:shadow-md transition-all duration-200 bg-white dark:bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted bg-white dark:bg-card">
            <h2 className="text-lg font-bold text-sidebar">Visualizaciones a mi Perfil Profesional</h2>
            <div className="flex items-center gap-1 text-xs font-semibold text-sidebar/40 uppercase tracking-wider">
              <span>Recientes</span>
            </div>
          </div>

          {loadingVisitas ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : visitantesRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-muted bg-muted/20">
                    <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Visitante</th>
                    <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Especialidad</th>
                    <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider">Visto hace</th>
                    <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted bg-white dark:bg-card">
                  {visitantesRecientes.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${visitor.bgColor}`}>
                            {visitor.avatarLetter}
                          </div>
                          <div className="max-w-[150px] sm:max-w-xs">
                            <h4 className="font-semibold text-sidebar text-base line-clamp-1">{visitor.nombre}</h4>
                            <p className="text-sm text-sidebar/50 line-clamp-1 mt-0.5">{visitor.cargo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-sidebar/70">
                          {visitor.especialidad}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-sidebar/50">
                          {visitor.tiempo}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link to={`/portafolio/${visitor.username}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-sm font-bold text-primary hover:bg-primary/5 hover:text-primary-hover px-3 rounded-lg">
                            Ver perfil
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
                <Eye className="w-10 h-10 text-sidebar/30" />
              </div>
              <h3 className="text-xl font-semibold text-sidebar mb-1">
                Aún no hay visualizaciones
              </h3>
              <p className="text-sm text-sidebar/60 max-w-sm mx-auto">
                Cuando otros usuarios visiten tu portafolio profesional, aparecerán aquí
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Grid: Recent Comments & Profile Completeness */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Comments Card */}
        <Card className="!p-0 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted bg-white dark:bg-card">
            <h2 className="text-lg font-bold text-sidebar">Últimos Comentarios a mis Proyectos</h2>
            <div className="flex items-center gap-1 text-xs font-semibold text-sidebar/40 uppercase tracking-wider">
              <span>Recientes</span>
            </div>
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
                    <th className="px-5 py-3 text-sm font-bold text-sidebar/50 uppercase tracking-wider text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted bg-white dark:bg-card">
                  {comentarios.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4">
                        {c.autor ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                              {c.autor.avatarLetter}
                            </div>
                            <span className="text-sm font-semibold text-sidebar line-clamp-1">
                              {c.autor.nombre}
                            </span>
                          </div>
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
                        {c.aprobado === 1 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 inline-block" />
                        ) : c.aprobado === 2 ? (
                          <XCircle className="w-5 h-5 text-destructive inline-block" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-400 inline-block" />
                        )}
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
        </Card>

        {/* Profile Completeness Card */}
        <Card className="hover:shadow-md transition-all duration-200">
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
            <div className="mt-5 pt-4 border-t border-muted">
              <Link to="/dashboard/perfil">
                <Button variant="ghost" size="sm" className="gap-1.5 text-primary text-sm font-semibold hover:bg-primary/5 px-0">
                  Completar mi perfil <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </Card>

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
