import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

/**
 * Modal de confirmación genérico y reutilizable.
 * Úsalo para cualquier acción destructiva o de cambio de estado.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel  = 'Cancelar',
  variant      = 'danger',
}: ConfirmDialogProps) {
  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger  = variant === 'danger';
  const iconBg    = isDanger ? 'bg-red-100  dark:bg-red-500/15'    : 'bg-amber-100 dark:bg-amber-500/15';
  const iconColor = isDanger ? 'text-red-500'                       : 'text-amber-500';
  const btnClass  = isDanger
    ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
    : 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md
          flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-muted">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h2 id="confirm-dialog-title" className="text-base font-semibold ">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="opacity-40 hover: transition-colors p-1 hover:bg-muted rounded-lg"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm opacity-70 leading-relaxed">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-5">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`inline-flex items-center justify-center font-medium rounded-lg
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              text-sm px-5 py-2.5 ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

