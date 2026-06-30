import { useState, useEffect, FormEvent, useRef } from 'react';
import { X, AlertCircle, Upload } from 'lucide-react';
import axios from 'axios';
import { Project } from '../pages/ProjectsPage';
import api, { buildUrl } from '../utils/api';

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
    demo: '',
    categoria_personalizada: ''
  });

  // Cargar categorías
  useEffect(() => {
    let isMounted = true;

    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        const data = response.data.data || response.data;
        
        if (isMounted) {
          setCategories(data);
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
        demo: projectToEdit.demoUrl || '',
        categoria_personalizada: projectToEdit.categoria_personalizada || ''
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
    const scrollToError = (elementName: string) => {
      setTimeout(() => {
        const element = document.querySelector(`[name="${elementName}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (element as HTMLElement).focus();
        }
      }, 50);
    };

    if (!formData.titulo.trim()) {
      setError('El título es obligatorio.');
      scrollToError('titulo');
      return false;
    }
    if (formData.descripcion.length < 50) {
      setError('La descripción debe tener al menos 50 caracteres.');
      scrollToError('descripcion');
      return false;
    }
    if (!formData.fecha_proyecto) {
      setError('fecha_error');
      scrollToError('fecha_proyecto');
      return false;
    }
    if (!formData.categoria_id) {
      setError('categoria_id_error');
      scrollToError('categoria_id');
      return false;
    }
    const selectedCategory = categories.find(c => c.id.toString() === formData.categoria_id);
    if (selectedCategory?.nombre === 'Otro' && !formData.categoria_personalizada.trim()) {
      setError('Debe especificar la nueva categoría.');
      scrollToError('categoria_personalizada');
      return false;
    }
    const techRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\,\-\+\#\(\)]+$/;
    const clientRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\,\-\&]+$/;

    if (!formData.tecnologias.trim()) {
      setError('tecnologias_error'); // Custom key to show inline
      scrollToError('tecnologias');
      return false;
    } else if (!techRegex.test(formData.tecnologias)) {
      setError('tecnologias_invalid_error');
      scrollToError('tecnologias');
      return false;
    }
    
    if (formData.herramientas && !techRegex.test(formData.herramientas)) {
      setError('herramientas_invalid_error');
      scrollToError('herramientas');
      return false;
    }

    if (formData.cliente && !clientRegex.test(formData.cliente)) {
      setError('cliente_invalid_error');
      scrollToError('cliente');
      return false;
    }

    if (!formData.github && !formData.demo) {
      setError('enlaces_error'); // Cambiamos el texto por una clave
      scrollToError('github');
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
    
    const selectedCategory = categories.find(c => c.id.toString() === formData.categoria_id);
    if (selectedCategory?.nombre === 'Otro' && formData.categoria_personalizada) {
      submitData.append('categoria_personalizada', formData.categoria_personalizada);
    }
    
    if (imageFile) {
      submitData.append('imagen', imageFile);
    }
    
    if (projectToEdit) {
      submitData.append('_method', 'PUT');
    }

    onSave(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-h-[90vh] flex flex-col w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header shrink-0 border-b pb-4 mb-0">
          <h2>{projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form flex flex-col overflow-hidden flex-1">
          <div className="modal-body flex-1 overflow-y-auto p-6 space-y-4">
            {error && !['tecnologias_error', 'categoria_id_error', 'tecnologias_invalid_error', 'herramientas_invalid_error', 'cliente_invalid_error', 'enlaces_error', 'fecha_error'].includes(error) && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md flex items-center gap-2 text-sm border border-red-200 dark:border-red-800">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Título del Proyecto <span className="text-red-500">*</span></label>
              <input type="text" name="titulo" className="form-input" value={formData.titulo} onChange={handleChange} placeholder="Ej: Sistema de Gestión CSER-SRL" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-&]+$" title="Solo letras, números, espacios, guiones y &" />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción <span className="text-red-500">*</span></label>
              <textarea name="descripcion" className="form-textarea min-h-[120px]" value={formData.descripcion} onChange={handleChange} placeholder="Describe el propósito del proyecto... (Mínimo 50 caracteres)" />
              <span className="text-xs text-gray-500 mt-1">{formData.descripcion.length} / 5000 caracteres (mínimo 50)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group flex flex-col justify-start">
                <label className="form-label">Categoría <span className="text-red-500">*</span></label>
                <select name="categoria_id" className={`form-select ${error === 'categoria_id_error' ? 'border-red-500 focus:ring-red-500' : ''}`} value={formData.categoria_id} onChange={handleChange}>
                  <option value="" disabled>Seleccione una categoría</option>
                  {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
                </select>
                {error === 'categoria_id_error' && (
                  <span className="text-xs text-red-500 mt-1 inline-flex items-center gap-1"><AlertCircle size={12}/> Debe seleccionar una categoría</span>
                )}
                {categories.find(c => c.id.toString() === formData.categoria_id)?.nombre === 'Otro' && (
                  <input 
                    type="text" 
                    name="categoria_personalizada" 
                    className="form-input mt-2" 
                    value={formData.categoria_personalizada} 
                    onChange={handleChange} 
                    maxLength={30}
                    placeholder="Especifique la categoría (Max. 30 car.)" 
                  />
                )}
              </div>
              <div className="form-group flex flex-col justify-start">
                <label className="form-label">
                  Fecha de Realización <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="fecha_proyecto" 
                  className={`form-input ${error === 'fecha_error' ? 'border-red-500 focus:ring-red-500' : ''}`} 
                  value={formData.fecha_proyecto} 
                  onChange={handleChange} 
                  max={new Intl.DateTimeFormat('fr-CA').format(new Date())} 
                />
                {error === 'fecha_error' && (
                  <span className="text-xs text-red-500 mt-1 inline-flex items-center gap-1">
                    <AlertCircle size={12}/> Debe seleccionar una fecha
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tecnologías <span className="text-red-500">*</span></label>
              <input type="text" name="tecnologias" className={`form-input ${(error === 'tecnologias_error' || error === 'tecnologias_invalid_error') ? 'border-red-500 focus:ring-red-500' : ''}`} value={formData.tecnologias} onChange={handleChange} placeholder="Ej: React, Laravel, Tailwind CSS" />
              {error === 'tecnologias_error' ? (
                <span className="text-xs text-red-500 mt-1 inline-flex items-center gap-1"><AlertCircle size={12}/> Debe agregar al menos una tecnología</span>
              ) : error === 'tecnologias_invalid_error' ? (
                <span className="text-xs text-red-500 mt-1 inline-flex items-center gap-1"><AlertCircle size={12}/> Contiene caracteres no permitidos</span>
              ) : (
                <span className="form-hint text-xs text-gray-500">Separa las tecnologías con comas</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Herramientas</label>
              <input type="text" name="herramientas" className={`form-input ${error === 'herramientas_invalid_error' ? 'border-red-500 focus:ring-red-500' : ''}`} value={formData.herramientas} onChange={handleChange} placeholder="Ej: Figma, Docker, Postman" />
              {error === 'herramientas_invalid_error' && (
                <span className="text-xs text-red-500 mt-1 inline-flex items-center gap-1"><AlertCircle size={12}/> Contiene caracteres no permitidos</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Cliente</label>
              <input type="text" name="cliente" className={`form-input ${error === 'cliente_invalid_error' ? 'border-red-500 focus:ring-red-500' : ''}`} value={formData.cliente} onChange={handleChange} />
              {error === 'cliente_invalid_error' && (
                <span className="text-xs text-red-500 mt-1 inline-flex items-center gap-1"><AlertCircle size={12}/> Contiene caracteres no permitidos</span>
              )}
            </div>

            <div className="form-group-wrapper">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">
                    URL de GitHub <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="url" 
                    name="github" 
                    className={`form-input ${error === 'enlaces_error' ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    value={formData.github} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">
                    URL de Demo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="url" 
                    name="demo" 
                    className={`form-input ${error === 'enlaces_error' ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    value={formData.demo} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              {error === 'enlaces_error' && (
                <span className="text-xs text-red-500 mt-2 inline-flex items-center gap-1">
                  <AlertCircle size={12}/> Debe proporcionar al menos un enlace (GitHub o Demo).
                </span>
              )}
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
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg transition-colors overflow-hidden relative bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full p-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
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
                      <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Haz clic o arrastra una imagen aquí
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP (MAX. 10MB)</p>
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