import { useState, useEffect, FormEvent } from 'react';
import { X, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  nombre: string;
}

interface ProjectModalProps {
  onClose: () => void;
  onSave: (projectData: any) => void; // Cambiado a 'any' para enviar el payload crudo a Laravel
}

export default function ProjectModal({ onClose, onSave }: ProjectModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Estado inicial mapeado EXACTAMENTE a las columnas de tu base de datos y Request de Laravel
  const [formData, setFormData] = useState({
    titulo: 'Nuevo Proyecto',
    descripcion: 'Esta es una descripción de ejemplo que tiene más de cincuenta caracteres para cumplir la validación.',
    categoria_id: '',
    fecha_proyecto: new Date().toISOString().split('T')[0],
    tecnologias: 'React, Node.js',
    herramientas: 'VS Code, Git',
    cliente: 'Yamil Angelo Lara B.',
    github: 'https://github.com/yamil-lara',
    demo: ''
  });

  // Obtener categorías reales del backend al abrir el modal
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Ajusta el puerto según tu entorno
        const response = await axios.get('http://localhost:8000/api/categorias');
        const data = response.data.data || response.data;
        setCategories(data);
        
        // Seleccionar la primera categoría por defecto si existen
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoria_id: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Limpiar errores al escribir
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // 1. Validación: Longitud de descripción (Regla de StoreProyectoRequest)
    if (formData.descripcion.length < 50) {
      setError('La descripción debe tener al menos 50 caracteres.');
      return;
    }

    // 2. Validación: Al menos un enlace (Regla personalizada conValidator)
    if (!formData.github && !formData.demo) {
      setError('Debe proporcionar al menos un enlace (GitHub o Demo).');
      return;
    }

    // Enviar los datos estructurados tal como los espera Laravel
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nuevo Proyecto</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            
            {/* Mensaje de error de validación */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 mb-4 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Título del Proyecto <span>*</span></label>
              {/* Cambiado name a 'titulo' */}
              <input 
                type="text" name="titulo" className="form-input" 
                value={formData.titulo} onChange={handleChange} required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción <span>*</span></label>
              {/* Cambiado name a 'descripcion' */}
              <textarea 
                name="descripcion" className="form-textarea" 
                value={formData.descripcion} onChange={handleChange} required 
              />
              <span className="text-xs text-gray-500">
                {formData.descripcion.length} / 5000 caracteres (mínimo 50)
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría <span>*</span></label>
                {/* Cambiado name a 'categoria_id' y carga dinámica */}
                <select 
                  name="categoria_id" className="form-select" 
                  value={formData.categoria_id} onChange={handleChange} required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Realización</label>
                {/* Cambiado name a 'fecha_proyecto' */}
                <input 
                  type="date" name="fecha_proyecto" className="form-input" 
                  value={formData.fecha_proyecto} onChange={handleChange} 
                  max={new Date().toISOString().split('T')[0]} // Regla: before_or_equal:today
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tecnologías <span>*</span></label>
              {/* Cambiado name a 'tecnologias' */}
              <input 
                type="text" name="tecnologias" className="form-input" 
                value={formData.tecnologias} onChange={handleChange} required
              />
              <span className="form-hint">Separa las tecnologías con comas</span>
            </div>

            <div className="form-group">
              <label className="form-label">Herramientas</label>
              {/* Cambiado name a 'herramientas' */}
              <input 
                type="text" name="herramientas" className="form-input" 
                value={formData.herramientas} onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cliente</label>
              {/* Cambiado name a 'cliente' */}
              <input 
                type="text" name="cliente" className="form-input" 
                value={formData.cliente} onChange={handleChange} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">URL de GitHub</label>
                {/* Cambiado name a 'github' */}
                <input 
                  type="url" name="github" className="form-input" 
                  value={formData.github} onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL de Demo</label>
                {/* Cambiado name a 'demo' */}
                <input 
                  type="url" name="demo" className="form-input" 
                  value={formData.demo} onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
}