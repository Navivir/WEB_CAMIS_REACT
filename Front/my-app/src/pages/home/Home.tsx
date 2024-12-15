import React, { useState, useEffect } from "react";
import Card from "../../components/cardHome/Card";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { GenerateToken, isValidToken } from "../../scripts/Session";


interface Product {
  id: number;
  name: string;
  imagen1: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        const valid = await isValidToken(token);
        console.log(valid);
        if (!valid){
          GenerateToken();   
        }
        else{
          console.log("Token still Working")
        }
        
      };
      validateToken();
    } else {
       // Si no hay token, marcarlo como no válido
    }
  }, [token]);




  useEffect(() => {
    fetch("http://localhost:8080/camis")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleClick = (id: number) => {
    // Navegar a la página de detalles con el id
    navigate(`/details/${id}`);
  };

  return (
    <div className="home-container">
      <div className="cards-container">
        {products.map((product, index) => (
          <Card
            key={index}
            title={product.name}
            imageUrl={`data:image/png;base64,${product.imagen1}`}
            onClick={() => handleClick(product.id)} // Aquí manejas el clic
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
