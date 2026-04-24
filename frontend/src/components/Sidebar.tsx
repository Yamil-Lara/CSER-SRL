import React, { useEffect, useState } from 'react';
import { 
  Code2, LayoutDashboard, User, FolderGit2, Wrench, 
  Briefcase, Link as LinkIcon, Eye, EyeOff, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dbUsername, setDbUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
         const payload = res.data.user || res.data.data || res.data;
         if (payload && payload.username) {
            setDbUsername(payload.username);
         }
      })
      .catch(err => console.error('Error fetching real DB username in sidebar:', err));
    }
  }, []);

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0' : '0 0.5rem' }}>
        <div className="sidebar-logo-icon">
          <Code2 size={20} color="white" />
        </div>
        {!isCollapsed && <span>DevFolio</span>}
      </div>

      <nav className="sidebar-nav">
        <SidebarItem to="/dashboard/resumen" icon={<LayoutDashboard size={18} />} text="Mi Resumen" isCollapsed={isCollapsed} />
        <SidebarItem to="/dashboard/perfil" icon={<User size={18} />} text="Editar Perfil" isCollapsed={isCollapsed} />
        <SidebarItem to="/dashboard/proyectos" icon={<FolderGit2 size={18} />} text="Mis Proyectos" isCollapsed={isCollapsed} />
        <SidebarItem to="/dashboard/habilidades" icon={<Wrench size={18} />} text="Mis Habilidades" isCollapsed={isCollapsed} />
        <SidebarItem to="/dashboard/experiencia" icon={<Briefcase size={18} />} text="Experiencia" isCollapsed={isCollapsed} />
        <SidebarItem to="/dashboard/enlaces" icon={<LinkIcon size={18} />} text="Enlaces" isCollapsed={isCollapsed} />
        <SidebarItem to="/dashboard/visibilidad" icon={<EyeOff size={18} />} text="Visibilidad" isCollapsed={isCollapsed} />
      </nav>

      <div className="sidebar-footer">
        <SidebarItem 
          icon={<Eye size={18} />} 
          text="Ver Portafolio" 
          isCollapsed={isCollapsed} 
          onClick={() => {
            const finalUsername = dbUsername || user?.username || '';
            navigate(`/portfolio/${finalUsername}`);
          }} 
        />
        
        {/* El botón de colapsar cambia el ícono dependiendo del estado */}
        <div className="sidebar-item" onClick={toggleSidebar} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span>Colapsar</span>}
        </div>
        
        <SidebarItem to="/" icon={<LogOut size={18} />} text="Cerrar sesión" isCollapsed={isCollapsed} danger />
      </div>
    </aside>
  );
}

// Componente helper para mantener el código limpio
function SidebarItem({ icon, text, isCollapsed, to, danger, onClick }: any) {
  const baseStyle = { 
    justifyContent: isCollapsed ? 'center' : 'flex-start', 
    padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem',
    textDecoration: 'none'
  };

  if (to) {
    return (
      <NavLink 
        to={to} 
        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${danger ? 'danger' : ''}`}
        style={baseStyle}
        title={isCollapsed ? text : ''}
      >
        {icon}
        {!isCollapsed && <span>{text}</span>}
      </NavLink>
    );
  }

  return (
    <div className={`sidebar-item ${danger ? 'danger' : ''}`} 
         style={baseStyle}
         title={isCollapsed ? text : ''}
         onClick={onClick}>
      {icon}
      {!isCollapsed && <span>{text}</span>}
    </div>
  );
}