import React, { useState, useEffect } from "react";
import Card from "../../components/cardHome/Card";
import "./Home.css";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  imagen1: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

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
      <h1 className="title">Create Your Own Design</h1>
      <div className="cards-container">
        {products.map((product, index) => (
          <Card
            key={index} // Asegúrate de usar una key única
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
