import { useState, useEffect, FormEvent } from 'react';
import { X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Project } from '../pages/ProjectsPage';

interface Category {
  id: number;
  nombre: string;
}

interface ProjectModalProps {
  onClose: () => void;
  onSave: (projectData: any) => void;
  projectToEdit?: Project | null;
}

export default function ProjectModal({ onClose, onSave, projectToEdit }: ProjectModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 1. Inicializamos SIEMPRE con los valores por defecto (útil para "Nuevo Proyecto")
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

  // 2. Cargamos las categorías del backend de forma segura
  useEffect(() => {
    let isMounted = true; // <-- 1. Creamos una bandera para saber si el modal está abierto

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categorias');
        const data = response.data.data || response.data;
        
        // <-- 2. Solo actualizamos el estado si el modal SIGUE abierto
        if (isMounted) { 
          setCategories(data);
          
          // Si estamos creando un proyecto nuevo, seleccionamos la primera categoría por defecto
          if (!projectToEdit && data.length > 0) {
            setFormData(prev => ({ ...prev, categoria_id: data[0].id.toString() }));
          }
        }
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    
    fetchCategorias();

    // <-- 3. Función de limpieza: React ejecuta esto justo cuando el modal se cierra
    return () => {
      isMounted = false; 
    };
  }, [projectToEdit]);

  // 3. Efecto CRUCIAL: Si estamos editando, sobrescribimos los datos con los del proyecto seleccionado
  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        titulo: projectToEdit.title || '',
        descripcion: projectToEdit.description || '',
        categoria_id: projectToEdit.categoryId || '',
        // Formatear la fecha para que el input type="date" lo entienda (YYYY-MM-DD)
        fecha_proyecto: projectToEdit.date ? projectToEdit.date.split('T')[0] : '', 
        tecnologias: projectToEdit.technologies ? projectToEdit.technologies.join(', ') : '',
        herramientas: projectToEdit.tools || '',
        cliente: projectToEdit.client || '',
        github: projectToEdit.githubUrl || '',
        demo: projectToEdit.demoUrl || ''
      });
    }
  }, [projectToEdit]); // Este efecto se ejecuta cada vez que el proyecto a editar cambia

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.descripcion.length < 50) {
      setError('La descripción debe tener al menos 50 caracteres.');
      return;
    }
    if (!formData.github && !formData.demo) {
      setError('Debe proporcionar al menos un enlace (GitHub o Demo).');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 mb-4 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Título del Proyecto <span>*</span></label>
              <input 
                type="text" name="titulo" className="form-input" 
                value={formData.titulo} onChange={handleChange} required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción <span>*</span></label>
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
                <select 
                  name="categoria_id" className="form-select" 
                  value={formData.categoria_id} onChange={handleChange} required
                >
                  <option value="" disabled>Seleccione una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Realización</label>
                <input 
                  type="date" name="fecha_proyecto" className="form-input" 
                  value={formData.fecha_proyecto} onChange={handleChange} 
                  max={new Date().toISOString().split('T')[0]} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tecnologías <span>*</span></label>
              <input 
                type="text" name="tecnologias" className="form-input" 
                value={formData.tecnologias} onChange={handleChange} required
              />
              <span className="form-hint">Separa las tecnologías con comas</span>
            </div>

            <div className="form-group">
              <label className="form-label">Herramientas</label>
              <input 
                type="text" name="herramientas" className="form-input" 
                value={formData.herramientas} onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cliente</label>
              <input 
                type="text" name="cliente" className="form-input" 
                value={formData.cliente} onChange={handleChange} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">URL de GitHub</label>
                <input 
                  type="url" name="github" className="form-input" 
                  value={formData.github} onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL de Demo</label>
                <input 
                  type="url" name="demo" className="form-input" 
                  value={formData.demo} onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}