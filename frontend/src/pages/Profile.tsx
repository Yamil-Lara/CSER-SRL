import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import SkillList from "../components/SkillList";
import SkillForm from "../components/SkillForm";
import ConfirmModal from "../components/ConfirmModal";

type Skill = {
  id: number;
  name: string;
  type: "tecnica" | "blanda";
  level: number;
};

const Profile = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const saveSkill = (skill: any) => {
    if (skill.id) {
      setSkills(skills.map((s) => (s.id === skill.id ? skill : s)));
    } else {
      setSkills([...skills, { ...skill, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setSkills(skills.filter((s) => s.id !== deleteId));
      setDeleteId(null);
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

      <SkillList
        skills={skills}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
        onAddFirst={handleAddNew}
      />

      {/* MODAL FORMULARIO */}
      <SkillForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={saveSkill}
        editingSkill={editingSkill}
        skills={skills}
      />

      {/* MODAL ELIMINAR */}
      {/* We keep ConfirmModal as it is, or we'll update it later if it uses bootstrap. Assuming it needs updating eventually but for now keeping prop footprint identical */}
      <ConfirmModal
        show={deleteId !== null}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Profile;