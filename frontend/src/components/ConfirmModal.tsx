import React from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { AlertTriangle, Info } from "lucide-react";

type Props = {
  show: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message?: string;
};

const ConfirmModal: React.FC<Props> = ({ show, onConfirm, onClose, message }) => {
  return (
    <Modal 
      isOpen={show} 
      onClose={onClose} 
      title={
        <span className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Confirmar eliminación
        </span>
      }
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onConfirm} className="!bg-destructive !text-white hover:!bg-destructive/90 border-none">
            Eliminar
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div className="p-2 bg-amber-100 rounded-full text-amber-600 mt-1">
          <Info className="w-6 h-6" />
        </div>
        <p className="text-sidebar/80 m-0">
          {message ?? '¿Estás seguro de que deseas eliminar esta habilidad? Esta acción no se puede deshacer.'}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;