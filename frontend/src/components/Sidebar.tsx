import { 
  Code2, 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Wrench, 
  Briefcase, 
  Link, 
  EyeOff, 
  ChevronLeft, 
  LogOut 
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Code2 size={20} color="white" />
        </div>
        DevFolio
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-item">
          <LayoutDashboard size={18} />
          <span>Mi Resumen</span>
        </div>
        <div className="sidebar-item">
          <User size={18} />
          <span>Editar Perfil</span>
        </div>
        <div className="sidebar-item active">
          <FolderGit2 size={18} />
          <span>Mis Proyectos</span>
        </div>
        <div className="sidebar-item">
          <Wrench size={18} />
          <span>Mis Habilidades</span>
        </div>
        <div className="sidebar-item">
          <Briefcase size={18} />
          <span>Experiencia</span>
        </div>
        <div className="sidebar-item">
          <Link size={18} />
          <span>Enlaces</span>
        </div>
        <div className="sidebar-item">
          <EyeOff size={18} />
          <span>Visibilidad</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-item">
          <EyeOff size={18} />
          <span>Ver mi Portafolio Público</span>
        </div>
        <div className="sidebar-item">
          <ChevronLeft size={18} />
          <span>Colapsar</span>
        </div>
        <div className="sidebar-item danger">
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </div>
      </div>
    </aside>
  );
}