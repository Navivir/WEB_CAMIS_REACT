// CartCard.tsx
import React from "react";
import "./CartCard.css";
import { ReactComponent as DeleteIcon } from "../../logos/basura.svg"; 

interface CartCardProps {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  onRemove: (id: number) => void;
}

const CartCard: React.FC<CartCardProps> = ({
  id,
  name,
  size,
  color,
  price,
  quantity,
  image,
  onRemove,
}) => {
  return (
    <div className="cart-item-card">
      <div className="cart-item-card-details">
        <h3>{name}</h3>
        <p>Talla: {size}</p>
        <p>Color: {color}</p>
        <p>Precio: {price.toFixed(2)} €</p>
        <p>Cantidad: {quantity}</p>
        <button onClick={() => onRemove(id)} className="remove-item-btn">
          <DeleteIcon className="remove-item-icon" />
        </button>
      </div>
      <img src={image} alt={name} className="cart-item-card-image" />
    </div>
  );
};

export default CartCard;
