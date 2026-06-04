import React from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Info } from "lucide-react";

type Props = {
  show: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  message?: string;
};

const ConfirmModal: React.FC<Props> = ({ 
  show, 
  onConfirm, 
  onClose,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar esta habilidad? Esta acción no se puede deshacer."
}) => {
  return (
    <Modal 
      isOpen={show} 
      onClose={onClose} 
      title={title}
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
        <p className="opacity-80 m-0 whitespace-pre-line">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
