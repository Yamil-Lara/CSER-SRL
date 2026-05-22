import { useState, useEffect, FormEvent, useRef } from 'react';
import { X, AlertCircle, Upload } from 'lucide-react';
import axios from 'axios';
import { Project } from '../pages/ProjectsPage';
import { buildUrl } from '../utils/api';

interface Category {
  id: number;
  nombre: string;
}

interface ProjectModalProps {
  onClose: () => void;
  onSave: (projectData: FormData) => void;
  projectToEdit?: Project | null;
}

export default function ProjectModal({ onClose, onSave, projectToEdit }: ProjectModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Cargar categorías
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
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, []);

  // Cargar datos del proyecto a editar
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
      
      if (projectToEdit.image) {
        const imageUrl = buildUrl(projectToEdit.image);
        if (imageUrl) {
          setImagePreview(imageUrl);
          setImageFile(null);
        }
      } else {
        setImagePreview(null);
        setImageFile(null);
      }
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  }, [projectToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const processFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WEBP');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no puede superar los 10MB');
      return false;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Manejadores de Drag & Drop sin estado isDragging
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      const dropZone = e.currentTarget;
      dropZone.classList.add('border-blue-500', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      const dropZone = e.currentTarget;
      dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    const dropZone = e.currentTarget;
    dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio.');
      return false;
    }
    if (formData.descripcion.length < 50) {
      setError('La descripción debe tener al menos 50 caracteres.');
      return false;
    }
    if (!formData.categoria_id) {
      setError('Debe seleccionar una categoría.');
      return false;
    }
    if (!formData.tecnologias.trim()) {
      setError('Debe agregar al menos una tecnología.');
      return false;
    }
    if (!formData.github && !formData.demo) {
      setError('Debe proporcionar al menos un enlace (GitHub o Demo).');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append('titulo', formData.titulo);
    submitData.append('descripcion', formData.descripcion);
    submitData.append('categoria_id', formData.categoria_id);
    if (formData.fecha_proyecto) submitData.append('fecha_proyecto', formData.fecha_proyecto);
    submitData.append('tecnologias', formData.tecnologias);
    if (formData.herramientas) submitData.append('herramientas', formData.herramientas);
    if (formData.cliente) submitData.append('cliente', formData.cliente);
    if (formData.github) submitData.append('github', formData.github);
    if (formData.demo) submitData.append('demo', formData.demo);
    
    if (imageFile) {
      submitData.append('imagen', imageFile);
    }
    
    if (projectToEdit) {
      submitData.append('_method', 'PUT');
    }

    onSave(submitData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-h-[90vh] flex flex-col w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header shrink-0 border-b pb-4 mb-0">
          <h2>{projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form flex flex-col overflow-hidden flex-1">
          <div className="modal-body flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm border border-red-200">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Título del Proyecto <span className="text-red-500">*</span></label>
              <input type="text" name="titulo" className="form-input" value={formData.titulo} onChange={handleChange} placeholder="Ej: Sistema de Gestión CSER-SRL" />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción <span className="text-red-500">*</span></label>
              <textarea name="descripcion" className="form-textarea min-h-[120px]" value={formData.descripcion} onChange={handleChange} placeholder="Describe el propósito del proyecto... (Mínimo 50 caracteres)" />
              <span className="text-xs text-gray-500 mt-1">{formData.descripcion.length} / 5000 caracteres (mínimo 50)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Categoría <span className="text-red-500">*</span></label>
                <select name="categoria_id" className="form-select" value={formData.categoria_id} onChange={handleChange}>
                  <option value="" disabled>Seleccione una categoría</option>
                  {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Realización</label>
                <input type="date" name="fecha_proyecto" className="form-input" value={formData.fecha_proyecto} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tecnologías <span className="text-red-500">*</span></label>
              <input type="text" name="tecnologias" className="form-input" value={formData.tecnologias} onChange={handleChange} placeholder="Ej: React, Laravel, Tailwind CSS" />
              <span className="form-hint text-xs text-gray-500">Separa las tecnologías con comas</span>
            </div>

            <div className="form-group">
              <label className="form-label">Herramientas</label>
              <input type="text" name="herramientas" className="form-input" value={formData.herramientas} onChange={handleChange} placeholder="Ej: Figma, Docker, Postman" />
            </div>

            <div className="form-group">
              <label className="form-label">Cliente</label>
              <input type="text" name="cliente" className="form-input" value={formData.cliente} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">URL de GitHub</label>
                <input type="url" name="github" className="form-input" value={formData.github} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">URL de Demo</label>
                <input type="url" name="demo" className="form-input" value={formData.demo} onChange={handleChange} />
              </div>
            </div>

            {/* Campo de Imagen CON DRAG & DROP sin parpadeo */}
            <div className="form-group">
              <label className="form-label">Imagen del Proyecto {!imagePreview && '(Opcional)'}</label>
              <div className="mt-2">
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg transition-colors overflow-hidden relative bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.preventDefault();
                          e.stopPropagation();
                          setImageFile(null); 
                          setImagePreview(null); 
                        }} 
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500">
                        Haz clic o arrastra una imagen aquí
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (MAX. 10MB)</p>
                    </div>
                  )}
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/jpg,image/webp" 
                  onChange={handleImageChange} 
                />
              </div>
              {imagePreview && (
                <p className="text-xs text-blue-500 mt-2">
                  ✓ Imagen cargada. Haz clic en la X para cambiarla.
                </p>
              )}
            </div>
          </div>

          <div className="modal-footer shrink-0 border-t pt-4 mt-0 bg-white flex justify-end gap-3">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">{projectToEdit ? 'Guardar Cambios' : 'Crear Proyecto'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}