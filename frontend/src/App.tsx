import React, { useEffect, useState } from 'react';
import api from './api/axios';

const App: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<string>("Cargando...");
  const [proyectosCount, setProyectosCount] = useState<number>(0);

  useEffect(() => {
    api.get('/status')
      .then(res => setDbStatus(res.data.mensaje))
      .catch(() => setDbStatus("Error: Backend desconectado"));

    api.get('/proyectos')
      .then(res => setProyectosCount(res.data.length))
      .catch(() => setProyectosCount(0));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Panel de Control, Backend corriendo exitosamente </h1>
      <hr />
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <p><strong>Estado de la API:</strong> {dbStatus}</p>
        <p><strong>Proyectos en BD:</strong> {proyectosCount} detectados</p>
      </div>
    </div>
  );
};

export default App;