import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSkill } from '../hooks/useSkill';
import SkillList from '../components/SkillList';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';

export function SkillsPage() {
  const { skills, loading, createSkill, updateSkill, deleteSkill } = useSkill();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'tecnica' as 'tecnica' | 'blanda',
    level: 50
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'tecnica',
      level: 50
    });
    setErrors({});
    setEditingSkill(null);
  };

  const handleOpenModal = (skill?: any) => {
    if (skill) {
      setFormData({
        name: skill.name,
        type: skill.type,
        level: skill.level || 50
      });
      setEditingSkill(skill.id);
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
    // CORRECCIÓN: Validamos formData.name en lugar de formData.nombre
    if (!formData.name.trim()) newErrors.name = 'El nombre de la habilidad es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (editingSkill) {
        await updateSkill(editingSkill, formData);
        setSuccessMessage('Habilidad actualizada correctamente');
      } else {
        await createSkill(formData);
        setSuccessMessage('Habilidad agregada correctamente');
      }
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Hubo un error al guardar la habilidad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta habilidad?')) {
      try {
        await deleteSkill(id);
        setSuccessMessage('Habilidad eliminada correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error: any) {
        setErrorMessage('Ocurrió un error al intentar eliminar la habilidad.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  return (
    <div className="page-body">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sidebar mb-2">Mis Habilidades</h1>
            <p className="text-sidebar/60">Gestiona tus habilidades técnicas y blandas</p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-5 h-5" />
            Nueva Habilidad
          </Button>
        </div>

        {/* Alertas */}
        {successMessage && <Alert type="success" message={successMessage} className="mb-6" />}
        {errorMessage && <Alert type="error" message={errorMessage} className="mb-6" />}

        {/* Lista de Habilidades */}
        {loading ? (
           <p className="text-center py-10 text-sidebar/60">Cargando habilidades...</p>
        ) : (
          <SkillList 
            skills={skills} 
            onEdit={handleOpenModal} 
            onDelete={handleDelete} 
            onAddFirst={() => handleOpenModal()} 
          />
        )}
      </div>

      {/* Modal para Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSkill ? 'Editar Habilidad' : 'Nueva Habilidad'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : editingSkill ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form className="space-y-6">
          <Select
            label="Tipo de Habilidad"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'tecnica' | 'blanda' })}
            options={[
              { value: 'tecnica', label: 'Habilidad Técnica' },
              { value: 'blanda', label: 'Habilidad Blanda' }
            ]}
            required
          />

          <Input
            label="Nombre de la Habilidad"
            name="name"
            placeholder={formData.type === 'tecnica' ? 'Ej: React, Laravel, Python' : 'Ej: Liderazgo, Comunicación'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-sidebar">
              Nivel de dominio ({formData.level}%)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}