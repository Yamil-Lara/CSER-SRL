import React, { useEffect, useState } from 'react';
import api from '../utils/api';

interface Proyecto {
    id: number;
    titulo: string;
    descripcion: string;
    tecnologias: string;
    categoria: {
        nombre: string;
        color: string;
    };
    usuario: {
        nombre: string;
    };
}

const ProjectList: React.FC = () => {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/proyectos')
            .then(res => {
                setProyectos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando proyectos", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center p-5">Cargando portafolios...</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-gradient">Proyectos Destacados</h2>
            <div className="row">
                {proyectos.map(p => (
                    <div key={p.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm border-0 hover-lift">
                            <div className="card-body">
                                <span className="badge mb-2" style={{ backgroundColor: p.categoria.color }}>
                                    {p.categoria.nombre}
                                </span>
                                <h5 className="card-title fw-bold">{p.titulo}</h5>
                                <p className="card-text text-muted">{p.descripcion.substring(0, 100)}...</p>
                                <div className="d-flex align-items-center mt-3">
                                    <small className="text-primary">Por: {p.usuario.nombre}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;