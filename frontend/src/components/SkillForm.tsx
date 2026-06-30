import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Alert } from "./ui/Alert";
import { Skill } from "../hooks/useSkill"; // Importamos la interfaz unificada

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (skill: Partial<Skill>) => Promise<void>;
  editingSkill?: Skill | null;
  skills: Skill[];
};

const SkillForm: React.FC<Props> = ({ show, onClose, onSave, editingSkill, skills }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"tecnica" | "blanda">("tecnica");
  const [level, setLevel] = useState(50);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      if (editingSkill) {
        setName(editingSkill.name);
        setType(editingSkill.type);
        setLevel(editingSkill.level);
      } else {
        setName("");
        setType("tecnica");
        setLevel(50);
      }
      setError("");
    }
  }, [show, editingSkill]);

  const validate = () => {
    if (!name.trim()) return "El nombre es obligatorio";
    
    // Nueva validación Regex: Solo letras (incluyendo acentos/ñ), espacios y el símbolo &
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\&]+$/;
    if (!nameRegex.test(name.trim())) {
      return "El nombre solo puede contener letras, espacios y el símbolo &";
    }

    if (level < 1 || level > 100) return "El nivel debe estar entre 1 y 100";

    const duplicate = skills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== editingSkill?.id
    );
    if (duplicate) return "Ya existe una habilidad con ese nombre";

    return "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSave({ id: editingSkill?.id, name: name.trim(), type, level });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar la habilidad';
      setError(errorMessage);
    }
  };

  return (
    <Modal 
      isOpen={show} 
      onClose={onClose} 
      title={editingSkill ? "Editar Habilidad" : "Nueva Habilidad"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingSkill ? "Actualizar" : "Crear"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre de la Habilidad *"
          placeholder="Ej: React, Liderazgo, Comunicación"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error && error.includes("nombre") ? error : ""}
        />

        <Select
          label="Tipo *"
          value={type}
          onChange={(e) => setType(e.target.value as "tecnica" | "blanda")}
          options={[
            { value: "tecnica", label: "Técnica" },
            { value: "blanda", label: "Blanda" }
          ]}
        />

        <div>
          <label className="block text-sm font-medium  mb-3">
            Nivel de Dominio: <span className="font-bold text-primary">{level}%</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between opacity-60 mt-2 text-xs">
            <span>Principiante</span>
            <span>Intermedio</span>
            <span>Avanzado</span>
            <span>Experto</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SkillForm;
