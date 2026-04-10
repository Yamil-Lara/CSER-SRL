import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Agregamos una clase dinámica al layout general
    <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <main className="main-content">
        <ProjectsPage />
      </main>
    </div>
  );
}

export default App;