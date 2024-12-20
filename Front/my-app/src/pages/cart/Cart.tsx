import React, { useState, useEffect } from "react";
import CartCard from "../../components/cartCard/CartCard";
import { isLoggedIn } from "../../scripts/Session";
import "./Cart.css";
import Modal from "../../components/modal/Modal";

interface CartItemData {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  id_cami: number;
  type: string;
  discount: number;
  image: string;
}

const Cart: React.FC = () => {
  const token = isLoggedIn() ? localStorage.getItem("authToken") : localStorage.getItem("token");

  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("¿Seguro que deseas eliminar este producto?");
  const [productToRemove, setProductToRemove] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8080/cart/${token}`)
        .then((response) => response.json())
        .then((data) => {
          setCartItems(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
          setCartItems([]);  
          setLoading(false);
        });
    }
  }, [token]);

  const handleRemoveItem = (id: number) => {
    setProductToRemove(id);
    setModalMessage("¿Seguro que deseas eliminar este producto?");
    setIsModalOpen(true);
  };

  const onConfirm = async () => {
    if (productToRemove && token) {
      try {
        const response = await fetch(`http://localhost:8080/cart/${token}/items/${productToRemove}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCartItems((prevItems) => prevItems.filter(item => item.id !== productToRemove));
        } else {
          console.error("Error al eliminar el producto del carrito");
        }
      } catch (error) {
        console.error("Error al intentar eliminar el producto:", error);
      }
    }
    setIsModalOpen(false); // Cerramos el modal
  };

  const onCancel = () => {
    setIsModalOpen(false); // Cerramos el modal sin hacer nada
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Tu Carrito 🛒</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="cart-items-cart">
          {cartItems.length === 0 ? (
            <p>No hay productos en tu carrito.</p>
          ) : (
            cartItems.map((item) => (
              <CartCard
                key={item.id}
                id={item.id}
                name={item.name}
                size={item.size}
                color={item.color}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
                onRemove={handleRemoveItem}  // Pasamos la función handleRemoveItem
              />
            ))
          )}
        </div>
      )}
      <div className="cart-total">
        <h2>Total: {calculateTotal().toFixed(2)} €</h2>
        <button className="checkout-btn">Proceder al pago</button>
      </div>

      {/* Modal de confirmación para eliminar producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={onCancel}
        message={modalMessage}
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmButtonText="Eliminar" // Texto del botón de confirmación
        cancelButtonText="Conservar" // Texto del botón de cancelación
        confirmButtonColor="#f08080" // Color del botón de confirmación (verde)
        cancelButtonColor="#5494de"
        
      />
    </div>
  );
};

export default Cart;
