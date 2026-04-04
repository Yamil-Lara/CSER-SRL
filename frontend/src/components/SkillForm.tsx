import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";

type Skill = {
  id?: number;
  name: string;
  type: "tecnica" | "blanda";
  level: number;
};

type Props = {
  onSave: (skill: Skill) => void;
  editingSkill?: Skill | null;
  skills: Skill[];
};

const SkillForm: React.FC<Props> = ({ onSave, editingSkill, skills }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"tecnica" | "blanda">("tecnica");
  const [level, setLevel] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingSkill) {
      setName(editingSkill.name);
      setType(editingSkill.type);
      setLevel(editingSkill.level);
    } else {
      setName("");
      setType("tecnica");
      setLevel(1);
      setError("");
    }
  }, [editingSkill]);

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

    if (!editingSkill) {
      setName("");
      setType("tecnica");
      setLevel(1);
    }
    setError("");
  };

  const handleCancel = () => {
    setName("");
    setType("tecnica");
    setLevel(1);
    setError("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h5 className="mb-4">
        {editingSkill ? (
          <>
            <i className="bi bi-pencil-square me-2"></i>
            Editar habilidad
          </>
        ) : (
          <>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva habilidad
          </>
        )}
      </h5>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="skillName">
            <Form.Label>Nombre de la habilidad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: JavaScript, Liderazgo, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!error && error.includes("nombre")}
            />
            <Form.Control.Feedback type="invalid">
              Por favor ingresa un nombre
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="skillType">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value as "tecnica" | "blanda")}
            >
              <option value="tecnica">🔧 Técnica</option>
              <option value="blanda">🤝 Blanda</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="skillLevel">
            <Form.Label>Nivel (1-100)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              isInvalid={!!error && error.includes("nivel")}
            />
            <Form.Control.Feedback type="invalid">
              Nivel inválido
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit">
          <i className="bi bi-save me-1"></i>
          {editingSkill ? "Actualizar" : "Guardar"}
        </Button>
        {editingSkill && (
          <Button variant="outline-secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </Form>
  );
};

export default SkillForm;