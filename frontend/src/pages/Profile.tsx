import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import SkillList from "../components/SkillList";
import SkillForm from "../components/SkillForm";
import ConfirmModal from "../components/ConfirmModal";
import { useSkill, Skill } from "../hooks/useSkill"; // Importamos la interfaz del hook
import { Alert } from "../components/ui/Alert";

const Profile = () => {
  const { skills, loading, error, createSkill, updateSkill, deleteSkill } = useSkill();

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const saveSkill = async (skillData: any) => {
    try {
      if (editingSkill && editingSkill.id) {
        await updateSkill(editingSkill.id, skillData);
        setActionMessage({ type: 'success', text: 'Habilidad actualizada correctamente' });
      } else {
        await createSkill(skillData);
        setActionMessage({ type: 'success', text: 'Habilidad agregada correctamente' });
      }
      setShowModal(false);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Error al guardar la habilidad' });
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteSkill(deleteId);
        setActionMessage({ type: 'success', text: 'Habilidad eliminada correctamente' });
      } catch (err: any) {
        setActionMessage({ type: 'error', text: 'Error al eliminar la habilidad' });
      } finally {
        setDeleteId(null);
        setTimeout(() => setActionMessage(null), 3000);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-sidebar mb-2">Mis Habilidades</h2>
          <p className="text-sidebar/60">Gestiona tus competencias técnicas y blandas</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={handleAddNew}>
          <Plus className="w-5 h-5" />
          Nueva Habilidad
        </Button>
      </div>

      {actionMessage && <Alert type={actionMessage.type} message={actionMessage.text} className="mb-6" />}
      {error && <Alert type="error" message={error} className="mb-6" />}

      {loading ? (
         <p className="text-center py-10 text-sidebar/60">Cargando habilidades...</p>
      ) : (
        <SkillList
          skills={skills}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
          onAddFirst={handleAddNew}
        />
      )}

      {showModal && (
        <SkillForm
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={saveSkill}
          editingSkill={editingSkill}
          skills={skills} 
        />
      )}

      <ConfirmModal
        show={deleteId !== null}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Profile;