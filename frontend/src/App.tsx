import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      .then(response => setData(response.data))
      .catch(error => console.error("Error de conexión:", error));
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 text-center">
        <h1 className="text-primary">CSER-SRL (TypeScript)</h1>
        <hr />
        {data ? (
          <h4 className="text-success">{data.mensaje}</h4>
        ) : (
          <p>Cargando datos del backend...</p>
        )}
      </div>
    </div>
  );
};

export default App;