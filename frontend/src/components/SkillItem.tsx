import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Skill } from "../hooks/useSkill"; // Importamos del hook

type Props = {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
};

const SkillItem: React.FC<Props> = ({ skill, onEdit, onDelete }) => {
  const isTecnica = skill.type === "tecnica";
  const progressBg = isTecnica ? "bg-primary" : "bg-accent";

  return (
    <div className="w-full py-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sidebar text-base">{skill.name}</span>
        <div className="flex items-center gap-4">
          <span className="text-sidebar/60 text-sm font-medium">{skill.level}%</span>
          <button 
            title="Editar habilidad" 
            className="text-sidebar/40 hover:text-primary transition-colors focus:outline-none" 
            onClick={() => onEdit(skill)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            title="Eliminar habilidad" 
            className="text-sidebar/40 hover:text-destructive transition-colors focus:outline-none" 
            onClick={() => skill.id && onDelete(skill.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className={`${progressBg} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
};

export default SkillItem;