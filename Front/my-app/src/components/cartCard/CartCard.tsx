// CartCard.tsx
import React, { useEffect, useState } from "react";
import "./CartCard.css";
import { FiTrash2, FiX } from "react-icons/fi";

interface CartCardProps {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  images: string[];
  onRemove: (id: number) => void;
}

const CartCard: React.FC<CartCardProps> = ({
  id,
  name,
  size,
  color,
  price,
  quantity,
  images,
  onRemove,
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!zoomedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedImage]);

  return (
    <div className="cart-item-card">
      <button
        onClick={() => onRemove(id)}
        className="remove-item-btn"
        aria-label="Eliminar producto"
        title="Eliminar producto"
      >
        <FiTrash2 className="remove-item-icon" />
      </button>

      <div className="cart-item-images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${name} - ${index + 1}`}
            className="cart-item-image-cart"
            onClick={() => setZoomedImage(image)}
          />
        ))}
      </div>

      <div className="cart-item-card-details">
        <h3>{name}</h3>
        <div className="cart-item-meta">
          <p>
            <span className="meta-label">Talla</span>
            <span className="meta-value">{size}</span>
          </p>
          <p>
            <span className="meta-label">Color</span>
            <span className="meta-value">{color}</span>
          </p>
          <p>
            <span className="meta-label">Precio</span>
            <span className="meta-value">{price.toFixed(2)} €</span>
          </p>
          <p>
            <span className="meta-label">Cantidad</span>
            <span className="meta-value">{quantity}</span>
          </p>
        </div>
      </div>

      {zoomedImage && (
        <div className="image-zoom-overlay" onClick={() => setZoomedImage(null)}>
          <button
            className="image-zoom-close"
            aria-label="Cerrar"
            onClick={() => setZoomedImage(null)}
          >
            <FiX />
          </button>
          <img
            src={zoomedImage}
            alt={name}
            className="image-zoom-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default CartCard;
