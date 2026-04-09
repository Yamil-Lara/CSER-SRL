import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import SkillItem from "./SkillItem";

type Props = {
  skills: any[];
  onEdit: (skill: any) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
};

const SkillList: React.FC<Props> = ({ skills, onEdit, onDelete, onAddFirst }) => {
  const tecnicas = skills.filter((s) => s.type === "tecnica");
  const blandas = skills.filter((s) => s.type === "blanda");

  const Section = ({ title, icon, data, typeLabel, iconClass, bgClass }: any) => (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
      <div className="d-flex align-items-center mb-4">
        <div className={`${bgClass} rounded-3 me-3 d-flex align-items-center justify-content-center`} style={{ width: '45px', height: '45px' }}>
          <i className={`bi ${icon} ${iconClass} fs-4`}></i>
        </div>
        <h4 className="fw-bold m-0 fs-5 text-dark">{title}</h4>
      </div>

      {data.length > 0 ? (
        <ListGroup variant="flush">
          {data.map((skill: any) => (
            <ListGroup.Item key={skill.id} className="px-0 py-2 border-0 bg-transparent">
              <SkillItem skill={skill} onEdit={onEdit} onDelete={onDelete} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3 text-light">
            <i className={`bi ${icon}`} style={{ fontSize: "4rem", opacity: 0.2 }}></i>
          </div>
          <p className="text-muted mb-4">No tienes habilidades {typeLabel} registradas</p>
          <Button variant="outline-primary" className="rounded-pill px-4" onClick={onAddFirst}>
            + Agregar Primera Habilidad
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Section title="Habilidades Técnicas" icon="bi-code" iconClass="text-primary" bgClass="bg-primary bg-opacity-10" data={tecnicas} typeLabel="técnicas" />
      <Section title="Habilidades Blandas" icon="bi-stars" iconClass="text-success" bgClass="bg-success bg-opacity-10" data={blandas} typeLabel="blandas" />
    </>
  );
};

export default SkillList;