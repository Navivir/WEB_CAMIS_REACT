import React, { useEffect, useState } from "react";
import Card from "../../components/cardItem/CardItem";
import "./MyDesigns.css";
import Modal from "../../components/modal/Modal";
import { CartItem } from "../../scripts/Types";
import CardHome, { handleClick } from "../../components/cardHome/CardHome";
import { Product } from "../../scripts/Types";
import { useNavigate } from "react-router-dom";

const MyDesigns = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    if (!userId) {
      setError("No user ID found.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/cartItem/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          console.error("Expected an array, but received:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching cart items:", error);
        setError("Error al cargar los diseños.");
      });
  }, []);

  const handleOpenModal = (id: number) => {
    setSelectedItemId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId !== null) {
      fetch(`http://localhost:8080/cartItem/${selectedItemId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setCartItems((prevItems) =>
              prevItems.filter((item) => item.id !== selectedItemId)
            );
          } else {
            alert("Hubo un problema al eliminar el diseño.");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el diseño:", error);
          alert("Hubo un error al intentar eliminar el diseño.");
        })
        .finally(() => {
          handleCloseModal();
        });
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("No user ID found.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8080/get-camis-user-id/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.content);
        setProducts(data.content);
      })
      .catch((error) => console.error("Error fetching camis:", error));
  }, []);

  const handleMakeItReal = (id: number) => {
    console.log("Hacerlo realidad con ID:", id);
    window.location.href = `/pre-cart?id=${id}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-design-container">
      <h1 className="cart-item-details-h1">Mis Diseños</h1>

      <div className="cart-items-my-designs">
        <h2 className="h2-my-designs-input-image">Tus Productos Creados:</h2>
        <div className="my-products-container">
          {cartItems.length === 0 ? (
            <p>No tienes diseños guardados.</p>
          ) : (
            cartItems.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                title={item.name}
                imageUrl={item.image}
                type={item.type}
                onClick={() => {
                  console.log("Card clicked:", item.id);
                }}
                onDelete={() => handleOpenModal(item.id)}
                onMakeItReal={handleMakeItReal}
              />
            ))
          )}
        </div>
      </div>
      <div className="cards-container-my-designs">
        <h2 className="h2-my-designs-input-image">Tus Diseños de Imagen:</h2>
        <div className="cards-container-my-designs-cards">
          {products.map((product, index) => (
            <CardHome
              key={index}
              title={product.name}
              imageUrl={`data:image/png;base64,${product.imagen1}`}
              onClick={() => handleClick(product.id, navigate)}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message="¿Estás seguro de que deseas eliminar este diseño?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseModal}
        confirmButtonText="Eliminar"
        cancelButtonText="Conservar"
        confirmButtonColor="#f08080"
        cancelButtonColor="#5494de"
        className={isModalOpen ? "second-modal" : ""}
      />
    </div>
  );
};

export default MyDesigns;
