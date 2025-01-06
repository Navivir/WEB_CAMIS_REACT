import { useEffect, useState } from "react";
import "./MyDesigns.css";
import CardItem from "../../components/cardItem/CardItem";
import CardImg from "../../components/cardImg/CardImg";
import { CartItem, ImageDesign, User } from "../../scripts/Types";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../scripts/Session";

const MyDesigns = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageDesign[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");
  const userIdNumber = userId ? parseInt(userId, 10) : 0;

  // Función para obtener los datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError("No user ID found.");
        setLoading(false);
        return;
      }

      try {
        const user = await getUserById(userIdNumber); // Pasamos el userIdNumber
        setUser(user); // Guardamos el usuario
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, userIdNumber]);

  // Obtener cart items
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
      });
  }, [userId]);

  // Obtener imágenes del usuario
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
  }, [userId]);

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
                created={item.created}
                images={item.images}
                onDelete={handleDeleteItem}
                onMakeItReal={handleMakeItReal}
                showActions={true}
                user_name={user ? user.username : "Usuario no encontrado"}
                user_image={user?.imagenPerfil || ""} 
              />
            ))
          )}
        </div>
      </div>
      <div className="cards-container-my-designs">
        <h2 className="h2-my-designs-input-image">Tus Diseños de Imagen:</h2>
        <div className="cards-container-my-designs-cards">
          {images.length === 0 ? (
            <p>No tienes imagenes guardadas</p>
          ):(
          images.map((img) => (
            <CardImg
              key={img.id}
              id={img.id}
              title={img.name}
              imageUrl={`data:image/png;base64, ${img.imagen1}`}
              onDelete={handleDeleteImg}
              onMakeItReal={handleDesign}
              showActions={true}
            />
          ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDesigns;
