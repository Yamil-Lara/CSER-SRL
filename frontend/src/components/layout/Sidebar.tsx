import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Code,
  Briefcase,
  Link as LinkIcon,
  EyeOff,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  MessageSquare,
  FileText,
  Shield,
  LucideIcon,
  Eye,
  Database,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import api from '../../utils/api';

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
};

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, loading } = useAuth();
  
  // Estados para las notificaciones dinámicas
  const [pendingProjects, setPendingProjects] = useState<number>(0);
  const [pendingComments, setPendingComments] = useState<number>(0);

  // Funciones de consulta a la API
  const fetchPendingProjects = () => {
    if (isAdmin) {
      api.get('/gestion/proyectos?estado=pendiente')
        .then(res => {
          const pendientes = res.data?.data?.stats?.pendientes || 0;
          setPendingProjects(pendientes);
        })
        .catch(err => console.error("Error al cargar notificaciones de proyectos:", err));
    }
  };

  const fetchPendingComments = () => {
    if (isAdmin) {
      api.get('/gestion/comentarios/pendientes')
        .then(res => {
          // Filtramos localmente los que tienen estado 'aprobado === 0' (pendiente)
          const allComments = res.data?.data || [];
          const pendingCount = allComments.filter((c: any) => c.aprobado === 0).length;
          setPendingComments(pendingCount);
        })
        .catch(err => console.error("Error al cargar notificaciones de comentarios:", err));
    }
  };

  // Efecto para inicializar contadores y escuchar actualizaciones "en vivo"
  useEffect(() => {
    fetchPendingProjects();
    fetchPendingComments();

    // Escuchamos los eventos que disparan las páginas de moderación al aprobar/rechazar
    window.addEventListener('proyectoActualizado', fetchPendingProjects);
    window.addEventListener('comentarioActualizado', fetchPendingComments);

    return () => {
      window.removeEventListener('proyectoActualizado', fetchPendingProjects);
      window.removeEventListener('comentarioActualizado', fetchPendingComments);
    };
  }, [isAdmin, location.pathname]);

  const handleLogout = async () => {
    await logout();
    // Redirección limpia al login para cumplir con la HU-14
    navigate('/login', { replace: true });
  };

  // Configuración de Menús según Rol
  const userMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Mi Resumen', path: '/dashboard' },
    { icon: User, label: 'Editar Perfil', path: '/dashboard/perfil' },
    { icon: FolderGit2, label: 'Mis Proyectos', path: '/dashboard/proyectos' },
    { icon: Code, label: 'Mis Habilidades', path: '/dashboard/habilidades' },
    { icon: Briefcase, label: 'Experiencia', path: '/dashboard/experiencia' },
    { icon: LinkIcon, label: 'Enlaces', path: '/dashboard/enlaces' },
    { icon: EyeOff, label: 'Visibilidad', path: '/dashboard/visibilidad' }
  ];

  const adminMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Vista Global', path: '/admin/dashboard' },
    { icon: Users, label: 'Gestión de Usuarios', path: '/admin/usuarios' },
    { 
        icon: CheckCircle, 
        label: 'Aprobaciones', 
        path: '/admin/aprobaciones', 
        badge: pendingProjects > 0 ? pendingProjects : undefined 
    },
    { 
        icon: MessageSquare, 
        label: 'Moderación', 
        path: '/admin/moderacion', 
        badge: pendingComments > 0 ? pendingComments : undefined 
    },
    { icon: Database, label: 'Backups', path: '/admin/backups' },
    { icon: Activity, label: 'Logs', path: '/admin/logs' },
    { icon: FileText, label: 'Reportes PDF', path: '/admin/reportes' }
  ];

  if (loading) return null;

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar/10 transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo de la aplicación */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar/10">
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">&lt;/&gt;</span>
          </div>
          {!isCollapsed && <span className="text-white font-bold text-lg tracking-tight">DevFolio</span>}
        </Link>
      </div>

      {/* Identificador de Administrador */}
      {isAdmin && !isCollapsed && (
        <div className="px-3 py-3 border-b border-sidebar/10">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Acceso Administrativo</span>
          </div>
        </div>
      )}

      {/* Navegación Principal */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${active ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : 'group-hover:scale-110 transition-transform'}`} />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge variant="destructive" className="ml-auto px-1.5 h-5 min-w-[20px] flex items-center justify-center text-[10px] animate-pulse">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {/* Badge flotante para modo colapsado */}
                {isCollapsed && item.badge !== undefined && (
                  <div className="absolute top-1 right-2 w-4 h-4 bg-destructive rounded-full flex items-center justify-center border-2 border-sidebar">
                    <span className="text-[8px] text-white font-bold">{item.badge}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Acciones de Cuenta y Sistema */}
      <div className="border-t border-sidebar/10 p-3 space-y-1">
        {!isAdmin && (
          <Link to={`/portfolio/${user?.username}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all" title={isCollapsed ? 'Ver Portafolio' : undefined}>
            <Eye className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Ver mi Portafolio</span>}
          </Link>
        )}

        <button onClick={toggleSidebar} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all">
          {isCollapsed ? <ChevronRight className="w-5 h-5 flex-shrink-0" /> : <><ChevronLeft className="w-5 h-5 flex-shrink-0" /><span className="text-sm font-medium">Colapsar menú</span></>}
        </button>

        {/* Botón Salir: HU-14 (Diferenciado en color #F63B3B) */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#F63B3B] hover:bg-[#F63B3B]/10 group" 
          title={isCollapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-sm font-bold tracking-wide">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}