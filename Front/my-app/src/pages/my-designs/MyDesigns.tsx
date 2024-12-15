import React, { useEffect, useState } from "react";
import Card from "../../components/cardItem/CardItem";  // Asegúrate de tener el componente Card correcto
import "./MyDesigns.css";

// Define una interfaz para el tipo de los elementos del carrito
interface CartItem {
  id: number;  // Cambiado a `id` en lugar de `productId`
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

  const handleDelete = (id: number) => {
    const confirmation = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
    if (confirmation) {
      fetch(`http://localhost:8080/cartItem/${id}`, {
        method: "DELETE", 
      })
        .then((response) => {
          if (response.ok) {
            // El producto ha sido eliminado correctamente
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Usa `id` para filtrar correctamente
            alert("Producto eliminado correctamente");
          } else {
            alert("Hubo un problema al eliminar el producto.");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          alert("Hubo un error al intentar eliminar el producto.");
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
      <h1>Mis Diseños</h1>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          cartItems.map((item) => (
            <Card
              key={item.id}  // Usamos `id` como la clave única
              id={item.id}  // Pasamos el `id` del producto
              title={item.name}  // Usamos el nombre del producto como título
              imageUrl={item.image}  // Usamos la URL de la imagen
              type={item.type}  // Usamos el tipo como tipo
              onClick={() => { 
                console.log("Card clicked:", item.id);
              }}
              onDelete={handleDelete}  // Pasamos la función para eliminar
              onMakeItReal={handleMakeItReal}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyDesigns;
