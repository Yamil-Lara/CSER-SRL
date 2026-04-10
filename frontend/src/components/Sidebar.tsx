import { 
  Code2, LayoutDashboard, User, FolderGit2, Wrench, 
  Briefcase, Link as LinkIcon, EyeOff, Eye, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar, activeView, setActiveView }: SidebarProps) {
  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0' : '0 0.5rem' }}>
        <div className="sidebar-logo-icon">
          <Code2 size={20} color="white" />
        </div>
        {!isCollapsed && <span>DevFolio</span>}
      </div>

      <nav className="sidebar-nav">
        <SidebarItem icon={<LayoutDashboard size={18} />} text="Mi Resumen" isCollapsed={isCollapsed} />
        
        <SidebarItem 
          icon={<User size={18} />} 
          text="Editar Perfil" 
          isCollapsed={isCollapsed} 
          active={activeView === 'perfil'}
          onClick={() => setActiveView('perfil')}
        />
        
        <SidebarItem 
          icon={<FolderGit2 size={18} />} 
          text="Mis Proyectos" 
          isCollapsed={isCollapsed} 
          active={activeView === 'proyectos'}
          onClick={() => setActiveView('proyectos')}
        />
        
        <SidebarItem icon={<Wrench size={18} />} text="Mis Habilidades" isCollapsed={isCollapsed} />
        <SidebarItem icon={<Briefcase size={18} />} text="Experiencia" isCollapsed={isCollapsed} />
        <SidebarItem icon={<LinkIcon size={18} />} text="Enlaces" isCollapsed={isCollapsed} />
        <SidebarItem icon={<Eye size={18} />} text="Visibilidad" isCollapsed={isCollapsed} />
      </nav>

      <div className="sidebar-footer">
        <SidebarItem 
          icon={<EyeOff size={18} />} 
          text="Ver Portafolio" 
          isCollapsed={isCollapsed}
          active={activeView === 'portafolio'}
          onClick={() => setActiveView('portafolio')}
        />
        
        <div className="sidebar-item" onClick={toggleSidebar} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', cursor: 'pointer' }}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span>Colapsar</span>}
        </div>
        
        <SidebarItem icon={<LogOut size={18} />} text="Cerrar sesión" isCollapsed={isCollapsed} danger />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, text, isCollapsed, active, danger, onClick }: any) {
  return (
    <div className={`sidebar-item ${active ? 'active' : ''} ${danger ? 'danger' : ''}`} 
         onClick={onClick}
         style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem', cursor: 'pointer' }}
         title={isCollapsed ? text : ''}>
      {icon}
      {!isCollapsed && <span>{text}</span>}
    </div>
  );
}