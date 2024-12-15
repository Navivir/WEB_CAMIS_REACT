import React, { useState, useEffect } from "react";
import CartCard from '../../components/cartCard/CartCard';
import { GenerateToken, isValidToken } from "../../scripts/Session";
import { isLoggedIn } from "../../scripts/Session";

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

  useEffect(() => {
    const validateAndGenerateToken = async () => {
      if (token) {
        const isTokenValid = await isValidToken(token);
        if (!isTokenValid) {
          console.log("Token inválido. Generando uno nuevo...");
          await GenerateToken();
        } else {
          console.log("Token válido.");
        }
      } else {
        console.log("No se encontró token. Generando uno...");
        await GenerateToken(); 
      }
    };

    validateAndGenerateToken();
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8080/cart/${token}`)
        .then((response) => response.json())
        .then((data) => {
          // Aseguramos que `data` sea un array
          setCartItems(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
          setCartItems([]);  // En caso de error, aseguramos que cartItems sea un array vacío
          setLoading(false);
        });
    }
  }, [token]);

  const handleRemoveItem = (id: number) => {
    // Eliminar item del carrito (solo localmente para este ejemplo)
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Tu Carrito</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="cart-items">
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
                onRemove={handleRemoveItem}
              />
            ))
          )}
        </div>
      )}
      <div className="cart-total">
        <h2>Total: ${calculateTotal().toFixed(2)}</h2>
        <button className="checkout-btn">Proceder al pago</button>
      </div>
    </div>
  );
};

export default Cart;
