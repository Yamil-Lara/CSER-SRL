import React, { useState, useRef } from 'react';
import { Plus, Briefcase, Edit, Trash2, Calendar, Building, Upload, X, Eye } from 'lucide-react';
import { useExperience } from '../hooks/useExperience';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import ConfirmModal from '../components/ConfirmModal';
import { buildUrl } from '../utils/api';

export function ExperienceLaboralPage() {
  const { experiences, createExperience, updateExperience, deleteExperience, loading } = useExperience();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // ESTADOS DE LA IMAGEN (DRAG & DROP)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagenEliminada, setImagenEliminada] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    tipo: 'laboral' as const,
    cargo_titulo: '',
    institucion_empresa: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    actual: 0,
    enlace_certificado: '', // NUEVO CAMPO
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const laboralExperiences = experiences.filter((e) => e.tipo === 'laboral');

  const resetForm = () => {
    setFormData({ tipo: 'laboral', cargo_titulo: '', institucion_empresa: '', descripcion: '', fecha_inicio: '', fecha_fin: '', actual: 0, enlace_certificado: '' });
    setErrors({});
    setEditingExp(null);
    setImageFile(null);
    setImagePreview(null);
    setImagenEliminada(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenModal = (expId?: number) => {
    if (expId) {
      setImagenEliminada(false);
      const exp = laboralExperiences.find((e) => e.id === expId);
      if (exp) {
        setFormData({
          tipo: 'laboral',
          cargo_titulo: exp.cargo_titulo,
          institucion_empresa: exp.institucion_empresa,
          descripcion: exp.descripcion || '',
          fecha_inicio: exp.fecha_inicio.split('T')[0],
          fecha_fin: exp.fecha_fin ? exp.fecha_fin.split('T')[0] : '',
          actual: exp.actual ? 1 : 0, // Corrección de tipo booleano a 1/0
          enlace_certificado: exp.enlace_certificado || '',
        });
        setEditingExp(expId);

        // Cargar vista previa si existe imagen en el servidor
        if (exp.imagen) {
          const imageUrl = buildUrl(exp.imagen);
          if (imageUrl) {
            setImagePreview(imageUrl);
            setImageFile(null);
          }
        } else {
          setImagePreview(null);
          setImageFile(null);
        }
      }
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cargo_titulo.trim()) newErrors.cargo_titulo = 'El cargo es obligatorio';
    if (!formData.institucion_empresa.trim()) newErrors.institucion_empresa = 'La empresa es obligatoria';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    if (!formData.actual && !formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es obligatoria si no es actual';
    if (formData.fecha_fin && formData.fecha_inicio && formData.fecha_fin < formData.fecha_inicio)
      newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la de inicio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MANEJADORES DE IMAGEN (Drag & Drop) ---
  const processFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Solo se permiten imágenes JPG, PNG o WEBP');
      setTimeout(() => setErrorMessage(''), 3000);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('La imagen no puede superar los 10MB');
      setTimeout(() => setErrorMessage(''), 3000);
      return false;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      e.currentTarget.classList.add('border-primary', 'bg-primary/5');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
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
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    // CONSTRUIR FORMDATA
    const submitData = new FormData();
    submitData.append('tipo', formData.tipo);
    submitData.append('cargo_titulo', formData.cargo_titulo);
    submitData.append('institucion_empresa', formData.institucion_empresa);
    submitData.append('descripcion', formData.descripcion || '');
    submitData.append('fecha_inicio', formData.fecha_inicio);
    submitData.append('fecha_fin', formData.fecha_fin || '');
    submitData.append('actual', formData.actual.toString());
    submitData.append('enlace_certificado', formData.enlace_certificado || '');

    if (imageFile) {
      submitData.append('imagen', imageFile);
    }
    
    if (imagenEliminada) {
      submitData.append('eliminar_imagen', '1');
    }

    try {
      if (editingExp) {
        await updateExperience(editingExp, submitData); // ENVIAR FORMDATA
        setSuccessMessage('Experiencia actualizada correctamente');
      } else {
        await createExperience(submitData); // ENVIAR FORMDATA
        setSuccessMessage('Experiencia creada correctamente');
      }
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error completo:', error);
      let errorMsg = "Ocurrió un error al guardar la experiencia.";
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        errorMsg = Array.isArray(firstError) ? firstError[0] as string : "Revisa los campos del formulario";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteExperience(pendingDeleteId);
      setSuccessMessage('Experiencia eliminada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Ocurrió un error al intentar eliminar la experiencia.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Experiencia Laboral</h1>
          <p className="page-subtitle">Gestiona tu trayectoria profesional</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Nueva Experiencia
        </button>
      </header>

      {successMessage && <Alert type="success" message={successMessage} className="mb-6" />}
      {errorMessage && <Alert type="error" message={errorMessage} className="mb-6" />}

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-sidebar">Experiencia Laboral</h2>
        </div>

        {loading ? (
          <p className="text-center py-6 text-sidebar/60">Cargando...</p>
        ) : laboralExperiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-sidebar/30" />
            </div>
            <p className="text-sidebar/60 mb-4">No tienes experiencia laboral registrada</p>
            <Button variant="outline" size="sm" onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="w-4 h-4" />
              Agregar Primera Experiencia
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {laboralExperiences.map((exp) => (
              <div key={exp.id} className="relative pl-8 pb-6 border-l-2 border-primary/20 last:border-l-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-800" />
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sidebar">{exp.cargo_titulo}</h3>
                    <div className="flex items-center gap-2 text-sidebar/70 mt-1">
                      <Building className="w-4 h-4" />
                      <span>{exp.institucion_empresa}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Corrección etiqueta Actual */}
                    {exp.actual ? <Badge variant="success" size="sm">Actual</Badge> : null}
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(exp.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPendingDeleteId(exp.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-sidebar/60 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(exp.fecha_inicio)} - {exp.actual ? 'Presente' : formatDate(exp.fecha_fin!)}</span>
                </div>
                
                {exp.descripcion && <p className="text-sm text-sidebar/70">{exp.descripcion}</p>}

                {/* BOTÓN DEL ENLACE EXTERNO */}
                {exp.enlace_certificado && (
                  <a 
                    href={exp.enlace_certificado} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors w-fit"
                  >
                    <Eye size={14} />
                    Ver Enlace Adjunto
                  </a>
                )}

                {/* VISUALIZACIÓN DE LA IMAGEN SUBIDA */}
                {exp.imagen && (
                  <div className="mt-3 group relative max-w-xs overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 transition-all hover:border-primary/40 hover:shadow-sm">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <img 
                        src={buildUrl(exp.imagen)} 
                        alt="Comprobante" 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <a 
                        href={buildUrl(exp.imagen)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-semibold gap-1.5 backdrop-blur-[1px]"
                      >
                        <Eye size={14} /> Ver Comprobante
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExp ? 'Editar Experiencia Laboral' : 'Nueva Experiencia Laboral'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : editingExp ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form className="space-y-6">
          <Input
            label="Cargo"
            name="cargo_titulo"
            placeholder="Ej: Desarrollador Full Stack"
            value={formData.cargo_titulo}
            onChange={(e) => setFormData({ ...formData, cargo_titulo: e.target.value })}
            error={errors.cargo_titulo}
            required
          />
          <Input
            label="Empresa"
            name="institucion_empresa"
            placeholder="Ej: Tech Company S.R.L."
            value={formData.institucion_empresa}
            onChange={(e) => setFormData({ ...formData, institucion_empresa: e.target.value })}
            error={errors.institucion_empresa}
            required
          />
          <Textarea
            label="Descripción"
            name="descripcion"
            placeholder="Describe tus responsabilidades y logros..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
              error={errors.fecha_inicio}
              required
            />
            <Input
              label="Fecha de Fin"
              name="fecha_fin"
              type="date"
              value={formData.fecha_fin}
              onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              error={errors.fecha_fin}
              disabled={formData.actual === 1}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="actual_laboral"
              // Corrección para que sea flexible con booleano o número 1
              checked={formData.actual === 1}
              onChange={(e) => setFormData({ ...formData, actual: e.target.checked ? 1 : 0, fecha_fin: '' })}
              className="w-4 h-4 text-primary bg-card border-muted rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="actual_laboral" className="text-sm text-sidebar">
              Actualmente trabajo aquí
            </label>
          </div>

          {/* CAMPO DE ENLACE */}
          <div className="mt-4">
            <Input
              label="Enlace adjunto (Ej: Carta de recomendación, proyecto, etc.)"
              name="enlace_certificado"
              type="url"
              placeholder="Ej: https://..."
              value={formData.enlace_certificado}
              onChange={(e) => setFormData({ ...formData, enlace_certificado: e.target.value })}
              error={errors.enlace_certificado}
            />
          </div>

          {/* CAMPO DE IMAGEN CON DRAG & DROP */}
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-sidebar">
              Imagen de respaldo o comprobante {!imagePreview && '(Opcional)'}
            </label>
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/30 dark:border-slate-600 rounded-lg transition-colors overflow-hidden relative bg-card dark:bg-slate-800/50 hover:bg-muted/50 dark:hover:bg-slate-700/50 cursor-pointer"
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
                        setImagenEliminada(true); 
                        if(fileInputRef.current) fileInputRef.current.value = '';
                      }} 
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors z-10 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Upload className="w-8 h-8 text-muted-foreground dark:text-slate-500 mb-3" />
                  <p className="text-sm font-medium text-sidebar dark:text-slate-300">
                    Haz clic o arrastra un archivo aquí
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-slate-500 mt-1">PNG, JPG, WEBP (MAX. 10MB)</p>
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
            {imagePreview && (
              <p className="text-xs text-primary mt-1">
                ✓ Archivo listo. Haz clic en la X para cambiarlo.
              </p>
            )}
          </div>
        </form>
      </Modal>

      <ConfirmModal
        show={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
        message="¿Estás seguro de que deseas eliminar esta experiencia laboral? Esta acción no se puede deshacer."
      />
    </div>
  );
}