import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/status')
      .then(response => setData(response.data))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-5 text-center" style={{ borderRadius: '15px' }}>
        <h1 className="display-4 text-primary fw-bold">CSER-SRL</h1>
        <hr />
        {data ? (
          <h3 className="text-success">{data.mensaje}</h3>
        ) : (
          <p>Conectando con Laravel 10...</p>
        )}
        <p className="mt-3 text-muted">Ingeniería Informática - TIS</p>
      </div>
    </div>
  );
};

export default App;