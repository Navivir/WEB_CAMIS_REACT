import React, { useState, useEffect } from "react";
import "./PreCart.css";
import { isLoggedIn } from "../../scripts/Session";
import Alert from "../../components/alert/Alert";

interface CartItem {
  id: number;
  name: string;
  size: string | null;
  color: string;
  price: number | null;
  quantity: number | null;
  id_cami: number;
  type: string;
  discount: number | null;
  image: string;
}


const PreCart: React.FC = () => {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "success"
  );

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const response = await fetch(`http://localhost:8080/cartItem/${id}`);
        const data = await response.json();
        setCartItem(data);
      } catch (error) {
        console.error("Error fetching cart item:", error);
      }
    };

    fetchCartItem();
  }, [id]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedQuantity(Number(event.target.value));
  };

  const handleAddToCart = async () => {
    if (!cartItem) {
      alert("Producto no encontrado.");
      return;
    }

    if (!selectedSize || selectedSize === "" || selectedQuantity <= 0) {
      setAlertMessage("Por favor seleccione una talla valida.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const tokenUnkonwn = localStorage.getItem("token");
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("UserId");

    const cartItemData = {
      id_cami: cartItem.id_cami,
      name: cartItem.name,
      size: selectedSize,
      quantity: selectedQuantity,
      image: cartItem.image,
      color: cartItem.color,
      price: 20,
      discount: cartItem.discount,
      type: cartItem.type,
    };

    try {
       
      const url = isLoggedIn()
        ? `http://localhost:8080/cart/${token}/${userId}`
        : `http://localhost:8080/cart/${tokenUnkonwn}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItemData),
      });

      if (response.ok) {
        window.location.href = `/cart`;
      } else {
        console.error("Error al agregar el producto al carrito.");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
    }
  };

  if (!cartItem) {
    return <p>Cargando información del producto...</p>;
  }

  return (
    <div className="cart-item-page">
         {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
      <h1 className="cart-item-page-h1">Seleccione talla y cantidad.</h1>
      <div className="cart-item-precart">
        <img
          src={cartItem.image}
          alt={cartItem.name}
          className="cart-item-image-pre"
        />
        <div className="cart-item-details-precart">
          <h2 className="name-h2">{cartItem.name}</h2>
          <div className="cart-item-controls">
            <label htmlFor="size-select">Talla:</label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={handleSizeChange}
              className="size-select"
            >
              <option value=""></option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <label htmlFor="quantity-select">Cantidad:</label>
            <select
              id="quantity-select"
              value={selectedQuantity}
              onChange={handleQuantityChange}
              className="quantity-select"
            >
              {[...Array(10)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>

            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreCart;
