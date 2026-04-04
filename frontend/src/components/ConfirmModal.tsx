import React from "react";
import { Modal, Button } from "react-bootstrap";

type Props = {
  show: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmModal: React.FC<Props> = ({ show, onConfirm, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2"></i>
          Confirmar eliminación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center">
          <i className="bi bi-question-circle text-warning me-3" style={{ fontSize: "2rem" }}></i>
          <p className="mb-0">¿Estás seguro de que deseas eliminar esta habilidad? Esta acción no se puede deshacer.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;