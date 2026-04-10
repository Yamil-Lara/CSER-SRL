import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import UserProfile from './components/UserProfile';
import ProjectList from './components/ProjectList'; // Asegúrate de ajustar la ruta si es necesario

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('perfil'); // Vista por defecto

  // Función para renderizar el contenido dinámicamente
  const renderContent = () => {
    switch (activeView) {
      case 'perfil':
        return <UserProfile />;
      case 'portafolio':
        return <ProjectList />;
      case 'proyectos':
        return <ProjectsPage />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;