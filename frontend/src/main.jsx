import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <div className="container mt-5">
    <div className="card shadow">
      <div className="card-body text-center">
        <h1 className="text-primary">CSER-SRL</h1>
        <p className="lead">Frontend con React 17 + Vite</p>
        <span className="badge bg-success">Entorno configurado correctamente</span>
      </div>
    </div>
  </div>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);