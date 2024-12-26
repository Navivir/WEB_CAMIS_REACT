import React, { useState, useEffect } from "react";
import CardHome from "../../components/cardHome/CardHome";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { GenerateToken, isValidToken } from "../../scripts/Session";
import Alert from "../../components/alert/Alert";
import {Product, CartItem} from "../../scripts/Types"
import CardItem from "../../components/cardItem/CardItem"


const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const[cartItems, setCartItems] = useState<CartItem[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>(""); // Nuevo estado para el nombre de la imagen
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("UserId");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "success"
  );

  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        const valid = await isValidToken(token);
        console.log(valid);
        if (!valid) {
          GenerateToken();
        }
      };
      validateToken();
    }
  }, [token]);

  useEffect(() => {
    fetch ("http://localhost:8080/cartItem/published")
        .then((response) => response.json())
        .then((data) => {
          setCartItems(data);
      
    }).catch((error) => console.error("Errror fetching the items", error))

  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/published")
      .then((response) => response.json())
      .then((data) => {
        const imgsList = data._embedded?.camisList || [];
        setProducts(imgsList);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewImage(reader.result as string); // Guarda la URL base64 en el estado
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageName(e.target.value);
    console.log("Image name:", e.target.value);
  };

  const handleSubmit = async () => {
    const parsedUserId = user_id ? parseInt(user_id) : null;

    if (!image) {
      setAlertMessage("Por favor selecciona una imagen.");
      setAlertType("error");
      setShowAlert(true);
    } else if (!imageName) {
      setAlertMessage("Por favor ingresa un nombre para la imagen.");
      setAlertType("error");
      setShowAlert(true);
    } else {
      const formData = new FormData();
      formData.append("imagen1", image);
      formData.append("name", imageName);

      try {
        let response;
        if (parsedUserId) {
          response = await fetch(
            `http://localhost:8080/add-new-cami/${parsedUserId}`,
            {
              method: "POST",
              body: formData,
            }
          );
        } else {
          response = await fetch("http://localhost:8080/cami", {
            method: "POST",
            body: formData,
          });
        }

        if (response.ok) {
          const responseData = await response.json();
          const designId = responseData.id;
          navigate(`/details/${designId}`);
        } else {
          console.error("Error uploading image");
          setAlertMessage("Hubo un problema al subir la imagen.");
          setAlertType("error");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setAlertMessage("Hubo un error al intentar enviar la imagen.");
        setAlertType("error");
        setShowAlert(true);
      }
    }
  };

  const handleClick = (id: number) => {
    // Navegar a la página de detalles con el id
    navigate(`/details/${id}`);
  };

  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  
  const handleMakeItReal = (id: number) => {
    console.log("Hacerlo realidad con ID:", id);
    window.location.href = `/pre-cart?id=${id}`;
  };

  return (
    <div className="home-container">
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="upload-section-home">
        <div className="input-container-home">
          <h2 className="h2-home-input-image">¡Diseña Tu Camiseta!</h2>
          <label className="input-label-home">
            <div className="file-input-container-home">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input-home"
              />

              {previewImage ? (
                // Si hay una imagen cargada, mostrarla
                <img
                  src={previewImage}
                  alt="Preview"
                  className="image-preview-home"
                />
              ) : (
                <span className="span-home-upload-image">
                  Haz click para añadir una imagen
                </span>
              )}
            </div>
          </label>

          {/* Input para añadir el nombre de la imagen */}
          <label className="input-label-home">
            <input
              type="text"
              placeholder="Ingresa un nombre para la imagen"
              value={imageName}
              onChange={handleNameChange}
              className="text-input-home"
            />
          </label>
          <button onClick={handleSubmit} className="upload-button-home">
            Siguiente
          </button>
        </div>
      </div>

      <div className="cards-container-home">
        <h2 className="h2-home-input-image">Diseños De La Comunidad:</h2>
        <div className="cards-container-home-cards">
          {products.map((product, index) => (
            <CardHome
              key={index}
              title={product.name}
              imageUrl={`data:image/png;base64,${product.imagen1}`}
              onClick={() => handleClick(product.id)}
            />
          ))}
        </div>
      </div>
      <div className = 'card-item-container'>
        <h2 className="h2-home-input-image">Productos Diseñados Por La Comunidad:</h2>
        <div className = 'cart-cards-item-container'>
          {cartItems.map((cartItem, index) => (
               <CardItem
              key={cartItem.id}
              id={cartItem.id}
              title={cartItem.name}
              imageUrl={cartItem.image}
              onDelete={handleDeleteItem}
              onMakeItReal={handleMakeItReal}
              showActions={false}
              
            />
          ))}

        </div>
      </div>
    </div>
  );
};

export default Home;
