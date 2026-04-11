import { useState, useEffect, FormEvent } from 'react';
import { X, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [step, setStep] = useState(1);

  // 1. Inicializamos con valores VACÍOS
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria_id: '',
    fecha_proyecto: '',
    tecnologias: '',
    herramientas: '',
    cliente: '',
    github: '',
    demo: ''
  });

  // 2. Cargar categorías
  useEffect(() => {
    let isMounted = true; 

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categorias');
        const data = response.data.data || response.data;
        
        if (isMounted) { 
          setCategories(data);
          
          if (!projectToEdit && data.length > 0) {
            setFormData(prev => ({ ...prev, categoria_id: data[0].id.toString() }));
          }
        }
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    
    fetchCategorias();

    return () => {
      isMounted = false; 
    };
  }, [projectToEdit]);

  // 3. Cargar datos si estamos en modo edición
  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        titulo: projectToEdit.title || '',
        descripcion: projectToEdit.description || '',
        categoria_id: projectToEdit.categoryId || '',
        fecha_proyecto: projectToEdit.date ? projectToEdit.date.split('T')[0] : '', 
        tecnologias: projectToEdit.technologies ? projectToEdit.technologies.join(', ') : '',
        herramientas: projectToEdit.tools || '',
        cliente: projectToEdit.client || '',
        github: projectToEdit.githubUrl || '',
        demo: projectToEdit.demoUrl || ''
      });
    }
  }, [projectToEdit]); 

  // --- FUNCIONES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // Funciones de navegación para la paginación
  const handleNext = () => {
    // Validaciones por paso
    if (step === 1) {
      if (!formData.titulo.trim()) return setError('El título es obligatorio.');
      if (formData.descripcion.length < 50) return setError('La descripción debe tener al menos 50 caracteres.');
      if (!formData.categoria_id) return setError('Debe seleccionar una categoría.');
    }
    if (step === 2) {
      if (!formData.tecnologias.trim()) return setError('Debe agregar al menos una tecnología.');
    }

    setError(null);
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validaciones del paso final
    if (!formData.github && !formData.demo) {
      setError('Debe proporcionar al menos un enlace (GitHub o Demo).');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* 1. Limitamos la altura máxima del modal y lo hacemos flex-col */}
      <div 
        className="modal-content max-h-[90vh] flex flex-col w-full max-w-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 2. El header se mantiene fijo (shrink-0) */}
        <div className="modal-header shrink-0 border-b pb-4 mb-0">
          <h2>{projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        {/* 3. El formulario toma el espacio restante y oculta el desbordamiento general */}
        <form onSubmit={handleSubmit} className="modal-form flex flex-col overflow-hidden flex-1">
          
          {/* 4. El cuerpo del modal ahora tiene overflow-y-auto para hacer scroll interno */}
          <div className="modal-body flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
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
                placeholder="Ej: Sistema de Gestión CSER-SRL"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción <span>*</span></label>
              <textarea 
                name="descripcion" className="form-textarea min-h-[100px]" 
                value={formData.descripcion} onChange={handleChange} required 
                placeholder="Describe el propósito del proyecto, los problemas que resuelve y tus principales aportes. (Mínimo 50 caracteres)"
              />
              <span className="text-xs text-gray-500 block mt-1">
                {formData.descripcion.length} / 5000 caracteres (mínimo 50)
              </span>
            </div>

            <div className="form-row flex gap-4">
              <div className="form-group flex-1">
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
              <div className="form-group flex-1">
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
                placeholder="Ej: React, Laravel, Tailwind CSS"
              />
              <span className="form-hint text-xs text-gray-500">Separa las tecnologías con comas</span>
            </div>

            <div className="form-group">
              <label className="form-label">Herramientas</label>
              <input 
                type="text" name="herramientas" className="form-input" 
                value={formData.herramientas} onChange={handleChange} 
                placeholder="Ej: Figma, Docker, Postman"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cliente</label>
              <input 
                type="text" name="cliente" className="form-input" 
                value={formData.cliente} onChange={handleChange} 
                placeholder="Ej: Universidad Mayor de San Simón"
              />
            </div>

            <div className="form-row flex gap-4">
              <div className="form-group flex-1">
                <label className="form-label">URL de GitHub</label>
                <input 
                  type="url" name="github" className="form-input" 
                  value={formData.github} onChange={handleChange} 
                  placeholder="https://github.com/usuario/repo"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">URL de Demo</label>
                <input 
                  type="url" name="demo" className="form-input" 
                  value={formData.demo} onChange={handleChange} 
                  placeholder="https://miproyecto.com"
                />
              </div>
            </div>
          </div>

          {/* 5. El footer se mantiene fijo en la parte inferior */}
          <div className="modal-footer shrink-0 border-t pt-4 mt-0 bg-white">
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