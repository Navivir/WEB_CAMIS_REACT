import React, { useState, useEffect } from 'react';
import './ImageRadioButtonColor.css';
import Alert from '../alert/Alert';
// Definir los tipos para la imagen
interface Image {
  src: string;
  alt: string;
  value: string;
}

// Definir los tipos para las props del componente
interface ImageRadioButtonProps {
  images: Image[];
  name: string;
  onChange: (value: string) => void;
  selectedValue: string;
  disabled?: boolean;
}

const ImageRadioButton: React.FC<ImageRadioButtonProps> = ({
  images,
  name,
  onChange,
  selectedValue,
  disabled = false, 
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Si el valor seleccionado cambia desde el componente padre, actualizar el estado local
    setSelected(selectedValue);

  }, [selectedValue]);

  const handleSelect = (value: string) => {
    if (disabled) {
      // Si está deshabilitado, mostrar la alerta
      setShowAlert(true);
    } else {
      setSelected(value);
      onChange(value); // Llamada a onChange para notificar al componente padre
    }
  };

  const closeAlert = () => {
    setShowAlert(false); // Función para cerrar la alerta
  };

  return (
    <div className="image-radio-buttons-color">
      {images.map((image, index) => (
        <label key={index} className="image-radio-button-color">
          <input
            type="radio"
            name={name}
            value={image.value}
            checked={selected === image.value}
            onChange={() => handleSelect(image.value)}
            style={{ display: 'none' }} // Ocultamos el radio button
            disabled={disabled} // Deshabilitamos el radio button si está activado el flag disabled
          />
          <div
            className={`image-container ${disabled ? 'disabled' : ''}`} // Agregamos clase 'disabled' si está deshabilitado
            onClick={() => handleSelect(image.value)}
          >
            <img src={image.src} alt={image.alt} />
          </div>
        </label>
      ))}
      {showAlert && (
        <Alert
          message="¡Oops! No puedes cambiar el color una vez un diseño ha sido aplicado."
          type="info"
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default ImageRadioButton;
