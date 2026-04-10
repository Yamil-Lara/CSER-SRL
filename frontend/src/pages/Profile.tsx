import React, { useState, useEffect } from "react";
import { Button, Nav } from "react-bootstrap";
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
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

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
    <div className="d-flex">
      {/* SIDEBAR */}
      <nav className="sidebar d-flex flex-column shadow">
        <div className="logo d-flex align-items-center">
          <i className="bi bi-code-slash text-primary me-2 fs-4"></i> DevFolio
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
          <Nav.Link href="#"><i className="bi bi-eye"></i> Ver mi Portafolio</Nav.Link>
          <Nav.Link href="#"><i className="bi bi-chevron-left"></i> Colapsar</Nav.Link>
          <Nav.Link href="#" className="text-danger"><i className="bi bi-box-arrow-right"></i> Cerrar sesión</Nav.Link>
        </Nav>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content p-5">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="fw-bold m-0 text-dark">Mis Habilidades</h2>
            <p className="text-muted">Gestiona tus competencias técnicas y blandas</p>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Button
              variant="outline-secondary"
              className="rounded-circle border-0 d-flex align-items-center justify-content-center bg-transparent shadow-none"
              style={{ width: "40px", height: "40px" }}
              onClick={toggleTheme}
            >
              {isDark ? (
                <i className="bi bi-sun-fill text-warning fs-5"></i>
              ) : (
                <i className="bi bi-moon-stars-fill text-secondary fs-5"></i>
              )}
            </Button>
            <Button variant="primary" className="px-4 py-2 rounded-3 shadow-sm fw-bold" onClick={handleAddNew}>
              + Nueva Habilidad
            </Button>
          </div>
        </div>

        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          <SkillList
            skills={skills}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            onAddFirst={handleAddNew}
          />
        </div>
      </main>

      {/* MODAL FORMULARIO */}
      <SkillForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={saveSkill}
        editingSkill={editingSkill}
        skills={skills}
      />

      {/* MODAL ELIMINAR */}
      <ConfirmModal
        show={deleteId !== null}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Profile;