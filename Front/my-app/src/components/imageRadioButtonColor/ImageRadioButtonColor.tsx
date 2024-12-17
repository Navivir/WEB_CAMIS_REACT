import React, { useState, useEffect } from 'react';
import "./ImageRadioButtonColor.css";

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
  selectedValue: string;  // Tipo de la función onChange
}

const ImageRadioButton: React.FC<ImageRadioButtonProps> = ({ images, name, onChange, selectedValue }) => {
  const [selected, setSelected] = useState<string | null>(null);
useEffect(() => {
    // Si el valor seleccionado cambia desde el componente padre, actualizar el estado local
    setSelected(selectedValue);
  }, [selectedValue]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange(value); // Llamada a onChange para notificar al componente padre
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
          />
          <div className="image-container" onClick={() => handleSelect(image.value)}>
            <img src={image.src} alt={image.alt} />
          </div>
        </label>
      ))}
    </div>
  );
};

export default ImageRadioButton;
