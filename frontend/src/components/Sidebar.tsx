import { 
  Code2, LayoutDashboard, User, FolderGit2, Wrench, 
  Briefcase, Link as LinkIcon, EyeOff, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0' : '0 0.5rem' }}>
        <div className="sidebar-logo-icon">
          <Code2 size={20} color="white" />
        </div>
        {!isCollapsed && <span>DevFolio</span>}
      </div>

      <nav className="sidebar-nav">
        {/* Usamos un helper para renderizar los items */}
        <SidebarItem icon={<LayoutDashboard size={18} />} text="Mi Resumen" isCollapsed={isCollapsed} />
        <SidebarItem icon={<User size={18} />} text="Editar Perfil" isCollapsed={isCollapsed} />
        <SidebarItem icon={<FolderGit2 size={18} />} text="Mis Proyectos" isCollapsed={isCollapsed} active />
        <SidebarItem icon={<Wrench size={18} />} text="Mis Habilidades" isCollapsed={isCollapsed} />
        <SidebarItem icon={<Briefcase size={18} />} text="Experiencia" isCollapsed={isCollapsed} />
        <SidebarItem icon={<LinkIcon size={18} />} text="Enlaces" isCollapsed={isCollapsed} />
        <SidebarItem icon={<EyeOff size={18} />} text="Visibilidad" isCollapsed={isCollapsed} />
      </nav>

      <div className="sidebar-footer">
        <SidebarItem icon={<EyeOff size={18} />} text="Ver Portafolio" isCollapsed={isCollapsed} />
        
        {/* El botón de colapsar cambia el ícono dependiendo del estado */}
        <div className="sidebar-item" onClick={toggleSidebar} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span>Colapsar</span>}
        </div>
        
        <SidebarItem icon={<LogOut size={18} />} text="Cerrar sesión" isCollapsed={isCollapsed} danger />
      </div>
    </aside>
  );
}

// Componente helper para mantener el código limpio
function SidebarItem({ icon, text, isCollapsed, active, danger }: any) {
  return (
    <div className={`sidebar-item ${active ? 'active' : ''} ${danger ? 'danger' : ''}`} 
         style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem' }}
         title={isCollapsed ? text : ''}>
      {icon}
      {!isCollapsed && <span>{text}</span>}
    </div>
  );
}