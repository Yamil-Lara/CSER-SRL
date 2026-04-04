import React, { useState } from "react";
import { Button, Nav, Row, Col } from "react-bootstrap";
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
  const [showForm, setShowForm] = useState(false);

  const saveSkill = (skill: any) => {
    if (skill.id) {
      setSkills(skills.map((s) => (s.id === skill.id ? skill : s)));
    } else {
      setSkills([...skills, { ...skill, id: Date.now() }]);
    }
    setEditingSkill(null);
    setShowForm(false);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setSkills(skills.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="d-flex">
      {/* BARRA LATERAL (SIDEBAR) */}
      <nav className="sidebar d-flex flex-column">
        <div className="logo text-white mb-4">
          <i className="bi bi-code-slash text-primary me-2"></i> DevFolio
        </div>
        
        <Nav className="flex-column flex-grow-1">
          <Nav.Link href="#"><i className="bi bi-grid"></i> Mi Resumen</Nav.Link>
          <Nav.Link href="#"><i className="bi bi-person"></i> Editar Perfil</Nav.Link>
          <Nav.Link href="#"><i className="bi bi-folder"></i> Mis Proyectos</Nav.Link>
          <Nav.Link href="#" className="active"><i className="bi bi-code"></i> Mis Habilidades</Nav.Link>
          <Nav.Link href="#"><i className="bi bi-briefcase"></i> Experiencia</Nav.Link>
          <Nav.Link href="#"><i className="bi bi-link-45deg"></i> Enlaces</Nav.Link>
        </Nav>

        <Nav className="flex-column mt-auto border-top border-secondary pt-2 mb-3">
          <Nav.Link href="#"><i className="bi bi-eye"></i> Ver mi Portafolio Público</Nav.Link>
          <Nav.Link href="#"><i className="bi bi-chevron-left"></i> Colapsar</Nav.Link>
          <Nav.Link href="#" className="text-danger"><i className="bi bi-box-arrow-right"></i> Cerrar sesión</Nav.Link>
        </Nav>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content p-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fw-bold m-0">Mis Habilidades</h2>
          <Button variant="primary" className="rounded-3 shadow-sm px-4" onClick={handleAddNew}>
            <i className="bi bi-plus-lg me-2"></i> Nueva Habilidad
          </Button>
        </div>
        <p className="text-muted mb-5">Gestiona tus competencias técnicas y blandas</p>

        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          {showForm && (
            <Row className="mb-4">
              <Col lg={12}>
                <div className="card shadow-sm border-0 p-4">
                  <SkillForm
                    onSave={saveSkill}
                    editingSkill={editingSkill}
                    skills={skills}
                  />
                  <Button
                    variant="link"
                    className="text-decoration-none text-muted mt-2"
                    onClick={() => setShowForm(false)}
                  >
                    Cerrar formulario
                  </Button>
                </div>
              </Col>
            </Row>
          )}

          <SkillList
            skills={skills}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            onAddFirst={handleAddNew}
          />
        </div>
      </main>

      <ConfirmModal
        show={deleteId !== null}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Profile;