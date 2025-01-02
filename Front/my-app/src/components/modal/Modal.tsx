import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean; // Si el modal está visible o no
  onClose: () => void; // Función para cerrar el modal
  message: string; // Mensaje que queremos mostrar
  onConfirm: () => void; // Función cuando el usuario hace click en "Ir a mis diseños"
  onCancel: () => void; // Función cuando el usuario hace click en "Quedarme y seguir diseñando"
  confirmButtonText: string; // Texto del botón de confirmación
  cancelButtonText: string; // Texto del botón de cancelación
  confirmButtonColor: string; // Color del botón de confirmación
  cancelButtonColor: string; // Color del botón de cancelación
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  message,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  confirmButtonColor,
  cancelButtonColor,
}) => {
  if (!isOpen) return null; // Si el modal no está abierto, no lo renderizamos

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="titleModal">{message}</h2>
        {/* Contenedor separado para los botones */}
        <div className="button-container">
          <button
            className="button1"
            onClick={onCancel}
            style={{ backgroundColor: cancelButtonColor }}
          >
            {cancelButtonText}
          </button>
          <button
            className="button2"
            onClick={onConfirm}
            style={{ backgroundColor: confirmButtonColor }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
      <div className="modal-overlay" onClick={onClose}></div> {/* Hace que el modal se cierre al hacer clic fuera */}
    </div>
  );
};

export default Modal;
