import { useEffect, useState } from "react";
import "./MyDesigns.css";
import CardItem from "../../components/cardItem/CardItem";
import CardImg from "../../components/cardImg/CardImg";
import { CartItem, ImageDesign } from "../../scripts/Types";
import { useNavigate } from "react-router-dom";

// import { TabItem } from "flowbite-react";

const MyDesigns = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageDesign[]>([]);
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
  }, [userId]); // El efecto se ejecutará cada vez que `userId` cambie


  useEffect(() => {
    if (!userId) {
      setError("No user ID found.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8080/get-camis-user-id/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const camisList = data._embedded?.camisList || [];
        setImages(camisList);
      })
      .catch((error) => console.error("Error fetching camis:", error));
  }, [userId]);  // El efecto se ejecutará cada vez que `userId` cambie

  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  
  const handleMakeItReal = (id: number) => {
    console.log("Hacerlo realidad con ID:", id);
    window.location.href = `/pre-cart?id=${id}`;
  };

  const handleDeleteImg = (id: number) => {
    setImages(images.filter((item) => item.id !== id));
  };

  const handleDesign = (id: number) => {
    console.log("Diseñar con ID:", id);
    navigate(`/details/${id}`);
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
              <CardItem
              key={item.id}
              id={item.id}
              title={item.name}
              imageUrl={item.image}
              onDelete={handleDeleteItem}
              onMakeItReal={handleMakeItReal}
              showActions={true}
            />
            ))
          )}
        </div>
      </div>
      <div className="cards-container-my-designs">
        <h2 className="h2-my-designs-input-image">Tus Diseños de Imagen:</h2>
        <div className="cards-container-my-designs-cards">
          {images.map((img) => (
           <CardImg
            key={img.id}
            id={img.id}
            title={img.name}
            imageUrl={`data:image/png;base64, ${img.imagen1}`}
            onDelete={handleDeleteImg}
            onMakeItReal={handleDesign}
            showActions={true}          
           />          
          ))}
        </div>
      </div>

   
    </div>
  );
};

export default MyDesigns;
