import React from "react";
import { ProgressBar } from "react-bootstrap";

type Skill = {
  id: number;
  name: string;
  type: "tecnica" | "blanda";
  level: number;
};

type Props = {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
};

const SkillItem: React.FC<Props> = ({ skill, onEdit, onDelete }) => {
  const isTecnica = skill.type === "tecnica";
  return (
    <div className="w-100 mb-2 mt-1">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-bold text-dark" style={{ fontSize: "1rem" }}>{skill.name}</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-secondary" style={{ fontSize: "0.95rem" }}>{skill.level}%</span>
          <button className="btn btn-link text-secondary p-0 border-0 text-decoration-none shadow-none" onClick={() => onEdit(skill)}>
            <i className="bi bi-pencil-square fs-6"></i>
          </button>
          <button className="btn btn-link text-secondary p-0 border-0 text-decoration-none shadow-none" onClick={() => onDelete(skill.id)}>
            <i className="bi bi-trash fs-6"></i>
          </button>
        </div>
      </div>
      <ProgressBar
        now={skill.level}
        variant={isTecnica ? "primary" : "success"}
        style={{ height: "10px", backgroundColor: "#f0f2f5" }}
      />
    </div>
  );
};

export default SkillItem;