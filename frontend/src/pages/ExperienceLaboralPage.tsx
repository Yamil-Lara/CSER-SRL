import React, { useState } from 'react';
import { Plus, Briefcase, Edit, Trash2, Calendar, Building } from 'lucide-react';
import { useExperience } from '../hooks/useExperience';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import ConfirmModal from '../components/ConfirmModal';

export function ExperienceLaboralPage() {
  const { experiences, createExperience, updateExperience, deleteExperience, loading } = useExperience();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    tipo: 'laboral' as const,
    cargo_titulo: '',
    institucion_empresa: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    actual: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const laboralExperiences = experiences.filter((e) => e.tipo === 'laboral');

  const resetForm = () => {
    setFormData({ tipo: 'laboral', cargo_titulo: '', institucion_empresa: '', descripcion: '', fecha_inicio: '', fecha_fin: '', actual: 0 });
    setErrors({});
    setEditingExp(null);
  };

  const handleOpenModal = (expId?: number) => {
    if (expId) {
      const exp = laboralExperiences.find((e) => e.id === expId);
      if (exp) {
        setFormData({
          tipo: 'laboral',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      if (editingExp) {
        await updateExperience(editingExp, formData);
        setSuccessMessage('Experiencia actualizada correctamente');
      } else {
        await createExperience(formData);
        setSuccessMessage('Experiencia creada correctamente');
      }
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Hubo un error al guardar la experiencia.');
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
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sidebar">{exp.cargo_titulo}</h3>
                    <div className="flex items-center gap-2 text-sidebar/70 mt-1">
                      <Building className="w-4 h-4" />
                      <span>{exp.institucion_empresa}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exp.actual === 1 && <Badge variant="success" size="sm">Actual</Badge>}
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
              checked={formData.actual === 1}
              onChange={(e) => setFormData({ ...formData, actual: e.target.checked ? 1 : 0, fecha_fin: '' })}
              className="w-4 h-4 text-primary bg-card border-muted rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="actual_laboral" className="text-sm text-sidebar">
              Actualmente trabajo aquí
            </label>
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
