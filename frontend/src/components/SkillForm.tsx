import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";

type Skill = {
  id?: number;
  name: string;
  type: "tecnica" | "blanda";
  level: number;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (skill: Skill) => void;
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
    if (level < 1 || level > 100) return "El nivel debe estar entre 1 y 100";

    const duplicate = skills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== editingSkill?.id
    );
    if (duplicate) return "Ya existe una habilidad con ese nombre";

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave({ id: editingSkill?.id, name: name.trim(), type, level });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 pb-0 mt-2 px-4">
          <Modal.Title className="fw-bold fs-4">
            {editingSkill ? "Editar Habilidad" : "Nueva Habilidad"}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="px-4 pb-0 pt-3">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-4" controlId="skillName">
            <Form.Label className="fw-semibold text-dark">
              Nombre de la Habilidad <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              className="py-2 text-secondary"
              placeholder="Ej: React, Liderazgo, Comunicación"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!error && error.includes("nombre")}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="skillType">
            <Form.Label className="fw-semibold text-dark">
              Tipo <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              className="py-2 text-dark"
              value={type}
              onChange={(e) => setType(e.target.value as "tecnica" | "blanda")}
            >
              <option value="tecnica">Técnica</option>
              <option value="blanda">Blanda</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4" controlId="skillLevel">
            <Form.Label className="fw-semibold text-dark mb-3">
              Nivel de Dominio: {level}%
            </Form.Label>
            <Form.Range
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between text-muted mt-2" style={{ fontSize: "0.80rem", padding: "0 2px" }}>
              <span>Principiante</span>
              <span>Intermedio</span>
              <span>Avanzado</span>
              <span>Experto</span>
            </div>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex justify-content-end gap-2">
          <Button variant="link" className="text-dark text-decoration-none fw-semibold" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" className="px-4 py-2 fw-semibold rounded-3 text-white">
            {editingSkill ? "Actualizar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SkillForm;