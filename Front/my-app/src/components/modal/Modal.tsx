import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean; // Si el modal está visible o no
  onClose: () => void; // Función para cerrar el modal
  message: string; // Mensaje que queremos mostrar
  onConfirm?: () => void; // Función cuando el usuario hace click en el botón de confirmación
  onCancel?: () => void; // Función cuando el usuario hace click en el botón de cancelación
  confirmButtonText?: string; // Texto del botón de confirmación (opcional)
  cancelButtonText?: string; // Texto del botón de cancelación (opcional)
  confirmButtonColor?: string; // Color del botón de confirmación (opcional)
  cancelButtonColor?: string; // Color del botón de cancelación (opcional)
  className?: string; // Clases CSS adicionales para estilizar el modal
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  message,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  confirmButtonColor = "#4CAF50", // Color por defecto si no se pasa
  cancelButtonColor = "#5494de", // Color por defecto si no se pasa
  className = "",
}) => {
  if (!isOpen) return null; // Si el modal no está abierto, no lo renderizamos

  return (
    <div className={`modal ${className}`}>
      <div className="modal-content">
        {/* Mensaje del modal */}
        <h2 className="titleModal">{message}</h2>

        {/* Contenedor separado para los botones */}
        <div className="button-container">
          {/* Renderiza el botón de cancelación solo si cancelButtonText no está vacío */}
          {cancelButtonText && (
            <button
              className="button1"
              onClick={onCancel}
              style={{ backgroundColor: cancelButtonColor }}
            >
              {cancelButtonText}
            </button>
          )}

          {/* Renderiza el botón de confirmación solo si confirmButtonText no está vacío */}
          {confirmButtonText && (
            <button
              className="button2"
              onClick={onConfirm}
              style={{ backgroundColor: confirmButtonColor }}
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Fondo del modal, cierra el modal al hacer clic */}
      <div className="modal-overlay" onClick={onClose}></div>
    </div>
  );
};

export default Modal;
