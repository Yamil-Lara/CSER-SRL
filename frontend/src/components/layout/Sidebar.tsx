import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  User,
  FolderGit2,
  Code,
  Briefcase,
  Link as LinkIcon,
  Eye,
  EyeOff,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  MessageSquare,
  FileText,
  Shield } from
'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { LucideIcon } from "lucide-react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
};
export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  // Menú para Usuario Normal
  const userMenuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Mi Resumen',
    path: '/dashboard'
  },
  {
    icon: User,
    label: 'Editar Perfil',
    path: '/dashboard/perfil'
  },
  {
    icon: FolderGit2,
    label: 'Mis Proyectos',
    path: '/dashboard/proyectos'
  },
  {
    icon: Code,
    label: 'Mis Habilidades',
    path: '/dashboard/habilidades'
  },
  {
    icon: Briefcase,
    label: 'Experiencia',
    path: '/dashboard/experiencia'
  },
  {
    icon: LinkIcon,
    label: 'Enlaces',
    path: '/dashboard/enlaces'
  },
  {
    icon: EyeOff,
    label: 'Visibilidad',
    path: '/dashboard/visibilidad'
  }];

  // Menú para Administrador
  const adminMenuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Vista Global',
    path: '/admin/dashboard'
  },
  {
    icon: Users,
    label: 'Gestión de Usuarios',
    path: '/admin/usuarios'
  },
  {
    icon: CheckCircle,
    label: 'Aprobaciones',
    path: '/admin/aprobaciones',
    badge: 3
  },
  {
    icon: MessageSquare,
    label: 'Moderación',
    path: '/admin/moderacion'
  },
  {
    icon: FileText,
    label: 'Reportes PDF',
    path: '/admin/reportes'
  }];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const isActive = (path: string) => location.pathname === path;
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar/10 transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar/10">
        <Link
          to={isAdmin ? '/admin/dashboard' : '/dashboard'}
          className="flex items-center gap-3">
          
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">&lt;/&gt;</span>
          </div>
          {!isCollapsed &&
          <span className="text-white font-bold text-lg tracking-tight">
              DevFolio
            </span>
          }
        </Link>
      </div>

      {/* Admin Badge */}
      {isAdmin && !isCollapsed &&
      <div className="px-3 py-3 border-b border-sidebar/10">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-xs font-semibold text-primary">
              Rol: ADMIN
            </span>
          </div>
        </div>
      }

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${active ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                title={isCollapsed ? item.label : undefined}>
                
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                
                {!isCollapsed &&
                <>
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                    {item.badge &&
                  <Badge
                    variant="destructive"
                    size="sm"
                    className="ml-auto">
                    
                        {item.badge}
                      </Badge>
                  }
                  </>
                }
                {isCollapsed && item.badge &&
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {item.badge}
                    </span>
                  </div>
                }
              </Link>);

          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar/10 p-3 space-y-1">
        {!isAdmin &&
        <Link
          to={`/portfolio/${user?.username}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
          title={isCollapsed ? 'Ver Portafolio Público' : undefined}>
          
            <Eye className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed &&
          <span className="text-sm font-medium">
                Ver mi Portafolio Público
              </span>
          }
          </Link>
        }

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}>
          
          {isCollapsed ?
          <ChevronRight className="w-5 h-5 flex-shrink-0" /> :

          <>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Colapsar</span>
            </>
          }
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive/90 hover:bg-destructive/10 hover:text-destructive transition-all"
          title={isCollapsed ? 'Cerrar sesión' : undefined}>
          
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed &&
          <span className="text-sm font-medium">Cerrar sesión</span>
          }
        </button>
      </div>
    </aside>);

}