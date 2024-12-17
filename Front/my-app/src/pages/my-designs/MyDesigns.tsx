import React, { useEffect, useState } from "react";
import Card from "../../components/cardItem/CardItem"; // Asegúrate de tener el componente Card correcto
import "./MyDesigns.css";
import Modal from "../../components/modal/Modal";

// Define una interfaz para el tipo de los elementos del carrito
interface CartItem {
  id: number;
  image: string;
  type: string;
  size: string;
  color: string;
  quantity: number;
  name: string;
}

const MyDesigns = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Usamos el tipo CartItem[] para el estado
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Error puede ser string o null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // ID del elemento seleccionado para eliminar

  useEffect(() => {
    const userId = localStorage.getItem("UserId");
    if (!userId) {
      setError("No user ID found.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/cartItem/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data); // Asumimos que la respuesta tiene el formato adecuado
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setError("There was an error fetching the cart items.");
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (id: number) => {
    setSelectedItemId(id); // Guardamos el ID del elemento que queremos eliminar
    setIsModalOpen(true); // Abrimos el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerramos el modal
    setSelectedItemId(null); // Limpiamos el ID seleccionado
  };

  const handleConfirmDelete = () => {
    if (selectedItemId !== null) {
      fetch(`http://localhost:8080/cartItem/${selectedItemId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // El producto ha sido eliminado correctamente
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== selectedItemId));
          } else {
            alert("Hubo un problema al eliminar el producto.");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          alert("Hubo un error al intentar eliminar el producto.");
        })
        .finally(() => {
          handleCloseModal(); // Cerramos el modal después de completar la operación
        });
    }
  };

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
        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
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

      {/* Modal para confirmar eliminación */}
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
