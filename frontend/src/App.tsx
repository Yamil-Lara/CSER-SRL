import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Profile from './pages/Profile';

// Definimos la "Interface" para que TS sepa qué trae el JSON de Laravel
interface StatusResponse {
  status: string;
  database: string;
  mensaje: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<StatusResponse | null>(null);

  useEffect(() => {
    axios.get<StatusResponse>('http://127.0.0.1:8000/api/status')
      .then((response: { data: React.SetStateAction<StatusResponse | null>; }) => setData(response.data))
      .catch((error: any) => console.error("Error de conexión:", error));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Profile />
    </div>
  );
};

export default App;