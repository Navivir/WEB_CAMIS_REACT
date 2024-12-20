import React from 'react';
import './Alert.css'; // Aquí puedes agregar los estilos del alert

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info'; // Puedes agregar más tipos si es necesario
  onClose: () => void; // Función para cerrar el alert
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="alert-close-button">
        X
      </button>
    </div>
  );
};

export default Alert;