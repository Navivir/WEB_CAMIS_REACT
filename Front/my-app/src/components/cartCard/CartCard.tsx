// src/components/cartCard/CartCard.tsx

import React from "react";
import "./CartCard.css";

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

const CartCard: React.FC<CartCardProps> = ({ id, name, size, color, price, quantity, image, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={image} alt={name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3>{name}</h3>
        <p>Size: {size}</p>
        <p>Color: {color}</p>
        <p>Price: {price.toFixed(2)} €</p>
        <p>Quantity: {quantity}</p>
        <button onClick={() => onRemove(id)} className="remove-item-btn">Eliminar</button>
      </div>
    </div>
  );
};

export default CartCard;
