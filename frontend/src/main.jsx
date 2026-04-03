import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Llamada a tu API de Laravel
    axios.get('http://127.0.0.1:8000/api/status')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error conectando con la API:", error);
      });
  }, []);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-5 text-center" style={{ borderRadius: '15px' }}>
        <h1 className="display-4 text-primary fw-bold">CSER-SRL</h1>
        <hr />
        {data ? (
          <div>
            <h3 className="text-success">{data.mensaje}</h3>
            <p className="badge bg-dark p-2">Estado DB: {data.database}</p>
          </div>
        ) : (
          <p>Cargando respuesta del servidor...</p>
        )}
        <p className="mt-3 text-muted">React 17 + Laravel 10</p>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));