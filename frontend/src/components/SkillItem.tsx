import React from "react";
import { Row, Col, Badge, Button, ProgressBar } from "react-bootstrap";

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

const getProgressVariant = (level: number): string => {
  if (level >= 80) return "success";
  if (level >= 60) return "info";
  if (level >= 40) return "warning";
  return "danger";
};

const SkillItem: React.FC<Props> = ({ skill, onEdit, onDelete }) => {
  return (
    <Row className="align-items-center">
      <Col md={8}>
        <div className="mb-2">
          <h6 className="mb-1 fw-bold">{skill.name}</h6>
          <Badge
            bg={skill.type === "tecnica" ? "primary" : "success"}
            className="me-2"
          >
            {skill.type === "tecnica" ? "🔧 Técnica" : "🤝 Blanda"}
          </Badge>
        </div>
        
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted">Nivel de dominio</small>
            <small className="fw-bold">{skill.level}%</small>
          </div>
          <ProgressBar
            now={skill.level}
            variant={getProgressVariant(skill.level)}
            label={`${skill.level}%`}
            striped
            animated
          />
        </div>
      </Col>

      <Col md={4} className="text-end">
        <Button
          variant="outline-warning"
          size="sm"
          className="me-2"
          onClick={() => onEdit(skill)}
        >
          <i className="bi bi-pencil me-1"></i>
          Editar
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(skill.id)}
        >
          <i className="bi bi-trash me-1"></i>
          Eliminar
        </Button>
      </Col>
    </Row>
  );
};

export default SkillItem;