import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import SkillItem from "./SkillItem";

type Skill = {
  id: number;
  name: string;
  type: "tecnica" | "blanda";
  level: number;
};

type Props = {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
};

const SkillList: React.FC<Props> = ({ skills, onEdit, onDelete, onAddFirst }) => {
  const tecnicas = skills.filter((s) => s.type === "tecnica");
  const blandas = skills.filter((s) => s.type === "blanda");

  const EmptyState = ({ title, icon }: { title: string; icon: string }) => (
    <div className="text-center py-5">
      <div className="mb-3 text-light">
        <i className={`bi ${icon}`} style={{ fontSize: "4rem", opacity: 0.2 }}></i>
      </div>
      <p className="text-muted mb-4">No tienes habilidades {title.toLowerCase()} registradas</p>
      <Button variant="outline-primary" className="rounded-pill px-4" onClick={onAddFirst}>
        + Agregar Primera Habilidad
      </Button>
    </div>
  );

  return (
    <div className="d-flex flex-column gap-4">
      {/* Sección Habilidades Técnicas */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-light p-2 rounded me-3">
            <i className="bi bi-code-slash text-primary"></i>
          </div>
          <h4 className="fw-bold m-0">Habilidades Técnicas</h4>
        </div>

        {tecnicas.length > 0 ? (
          <ListGroup variant="flush">
            {tecnicas.map((skill) => (
              <ListGroup.Item key={skill.id} className="px-0 py-3 border-light">
                <SkillItem skill={skill} onEdit={onEdit} onDelete={onDelete} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <EmptyState title="técnicas" icon="bi-code-slash" />
        )}
      </div>

      {/* Sección Habilidades Blandas */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-light p-2 rounded me-3">
            <i className="bi bi-people text-info"></i>
          </div>
          <h4 className="fw-bold m-0">Habilidades Blandas</h4>
        </div>

        {blandas.length > 0 ? (
          <ListGroup variant="flush">
            {blandas.map((skill) => (
              <ListGroup.Item key={skill.id} className="px-0 py-3 border-light">
                <SkillItem skill={skill} onEdit={onEdit} onDelete={onDelete} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <EmptyState title="blandas" icon="bi-people" />
        )}
      </div>
    </div>
  );
};

export default SkillList;