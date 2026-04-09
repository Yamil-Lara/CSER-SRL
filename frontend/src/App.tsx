import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <ProjectsPage />
      </main>
    </div>
  );
}

export default App;