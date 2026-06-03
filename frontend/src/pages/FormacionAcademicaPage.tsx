import React, { useState } from 'react';
import { Plus, GraduationCap, Edit, Trash2, Calendar, Building, Eye, Image } from 'lucide-react';
import { useExperience } from '../hooks/useExperience';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import ConfirmModal from '../components/ConfirmModal';
// IMPORTAR buildUrl DESDE TU UTILERÍA DE API
import { buildUrl } from '../utils/api';

export function FormacionAcademicaPage() {
  const { experiences, createExperience, updateExperience, deleteExperience, loading } = useExperience();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    tipo: 'academica' as const,
    cargo_titulo: '',
    institucion_empresa: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    actual: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const academicExperiences = experiences.filter((e) => e.tipo === 'academica');

  const resetForm = () => {
    setFormData({ tipo: 'academica', cargo_titulo: '', institucion_empresa: '', descripcion: '', fecha_inicio: '', fecha_fin: '', actual: 0 });
    setImagen(null); // Resetear imagen
    setErrors({});
    setEditingExp(null);
  };

  const handleOpenModal = (expId?: number) => {
    if (expId) {
      const exp = academicExperiences.find((e) => e.id === expId);
      if (exp) {
        setFormData({
          tipo: 'academica',
          cargo_titulo: exp.cargo_titulo,
          institucion_empresa: exp.institucion_empresa,
          descripcion: exp.descripcion || '',
          fecha_inicio: exp.fecha_inicio.split('T')[0],
          fecha_fin: exp.fecha_fin ? exp.fecha_fin.split('T')[0] : '',
          actual: exp.actual,
        });
        setEditingExp(expId);
      }
    } else {
      resetForm();
    }
    setImagen(null); // Asegurarse de limpiar el file input al abrir el modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cargo_titulo.trim()) newErrors.cargo_titulo = 'El título/carrera es obligatorio';
    if (!formData.institucion_empresa.trim()) newErrors.institucion_empresa = 'La institución es obligatoria';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    if (!formData.actual && !formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es obligatoria si no está en curso';
    if (formData.fecha_fin && formData.fecha_inicio && formData.fecha_fin < formData.fecha_inicio)
      newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la de inicio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    // CREAR EL FORM DATA
    const submitData = new FormData();
    submitData.append('tipo', formData.tipo);
    submitData.append('cargo_titulo', formData.cargo_titulo);
    submitData.append('institucion_empresa', formData.institucion_empresa);
    submitData.append('descripcion', formData.descripcion || ''); // Garantizar que exista
    submitData.append('fecha_inicio', formData.fecha_inicio);
    submitData.append('fecha_fin', formData.fecha_fin || '');     // Garantizar que exista
    submitData.append('actual', formData.actual.toString());
    
    // Adjuntar archivo si el usuario seleccionó uno
    if (imagen) {
      submitData.append('imagen', imagen);
    }

    try {
      if (editingExp) {
        await updateExperience(editingExp, submitData); // Enviar submitData en lugar de formData
        setSuccessMessage('Formación actualizada correctamente');
      } else {
        await createExperience(submitData); // Enviar submitData en lugar de formData
        setSuccessMessage('Formación creada correctamente');
      }
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error completo:', error);
      let errorMsg = "Ocurrió un error al guardar la formación.";
      
      // Extraemos los errores específicos de los campos desde Laravel
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        // En Laravel, los errores vienen en arreglos por campo
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
      setSuccessMessage('Formación eliminada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Ocurrió un error al intentar eliminar la formación.');
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
          <h1 className="page-title">Formación Académica</h1>
          <p className="page-subtitle">Gestiona tu trayectoria educativa</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Nueva Formación
        </button>
      </header>

      {successMessage && <Alert type="success" message={successMessage} className="mb-6" />}
      {errorMessage && <Alert type="error" message={errorMessage} className="mb-6" />}

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/10">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-sidebar">Formación Académica</h2>
        </div>

        {loading ? (
          <p className="text-center py-6 text-sidebar/60">Cargando...</p>
        ) : academicExperiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-sidebar/30" />
            </div>
            <p className="text-sidebar/60 mb-4">No tienes formación académica registrada</p>
            <Button variant="outline" size="sm" onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="w-4 h-4" />
              Agregar Primera Formación
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {academicExperiences.map((exp) => (
              <div key={exp.id} className="relative pl-8 pb-6 border-l-2 border-accent/20 last:border-l-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sidebar">{exp.cargo_titulo}</h3>
                    <div className="flex items-center gap-2 text-sidebar/70 mt-1">
                      <Building className="w-4 h-4" />
                      <span>{exp.institucion_empresa}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exp.actual === 1 && <Badge variant="success" size="sm">En curso</Badge>}
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

                {/* NUEVO BLOQUE: VISUALIZACIÓN DE LA IMAGEN SUBIDA */}
                {exp.imagen && (
                  <div className="mt-3 group relative max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 transition-all hover:border-accent/40 hover:shadow-sm">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                      <img 
                        src={buildUrl(exp.imagen)} 
                        alt="Certificado o comprobante" 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Capa interactiva para ampliar al hacer clic */}
                      <a 
                        href={buildUrl(exp.imagen)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-semibold gap-1.5 backdrop-blur-[1px]"
                      >
                        <Eye size={14} /> Ver Certificado
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
        title={editingExp ? 'Editar Formación Académica' : 'Nueva Formación Académica'}
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
            label="Título / Carrera"
            name="cargo_titulo"
            placeholder="Ej: Ingeniería de Sistemas Informáticos"
            value={formData.cargo_titulo}
            onChange={(e) => setFormData({ ...formData, cargo_titulo: e.target.value })}
            error={errors.cargo_titulo}
            required
          />
          <Input
            label="Institución"
            name="institucion_empresa"
            placeholder="Ej: Universidad Mayor de San Simón"
            value={formData.institucion_empresa}
            onChange={(e) => setFormData({ ...formData, institucion_empresa: e.target.value })}
            error={errors.institucion_empresa}
            required
          />

          {/* MUESTRA LA IMAGEN ACTUAL SI ESTAMOS EDITANDO Y YA TIENE UNA */}
          {editingExp && academicExperiences.find(e => e.id === editingExp)?.imagen && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-sidebar flex items-center gap-1.5">
                <Image size={16} className="text-accent" /> Documento adjunto actual:
              </label>
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border bg-muted group">
                <img 
                  src={buildUrl(academicExperiences.find(e => e.id === editingExp)?.imagen || '')} 
                  alt="Vista previa actual" 
                  className="w-full h-full object-cover"
                />
                <a 
                  href={buildUrl(academicExperiences.find(e => e.id === editingExp)?.imagen || '')} 
                  target="_blank" 
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
                >
                  <Eye size={12} className="mr-1" /> Ver grande
                </a>
              </div>
              <p className="text-xs text-sidebar/50">Si seleccionas un archivo nuevo abajo, se reemplazará el actual.</p>
            </div>
          )}

          <Input
            label="Certificado o Imagen de respaldo (Opcional)"
            name="imagen"
            type="file"
            accept="image/jpeg, image/png, image/jpg, image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImagen(e.target.files[0]);
              }
            }}
          />
          <Textarea
            label="Descripción"
            name="descripcion"
            placeholder="Describe tu formación, logros o actividades relevantes..."
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
              id="actual_academica"
              checked={formData.actual === 1}
              onChange={(e) => setFormData({ ...formData, actual: e.target.checked ? 1 : 0, fecha_fin: '' })}
              className="w-4 h-4 text-primary bg-card border-muted rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="actual_academica" className="text-sm text-sidebar">
              Actualmente estudio aquí
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        show={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
        message="¿Estás seguro de que deseas eliminar esta formación académica? Esta acción no se puede deshacer."
      />
    </div>
  );
}
