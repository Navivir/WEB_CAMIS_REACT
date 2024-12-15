import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useParams } from "react-router-dom";
import "./Details.css";
import Modal from "../../components/modal/Modal";

interface Product {
  imagen1: string;
  imagenDelantera: string;
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [colorProduct, setColorProduct] = useState<Product | null>(null);
  const [selectedType, setSelectedType] = useState<string>("manga-corta");
  const [selectedColor, setSelectedColor] = useState<string>("negro");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userName = localStorage.getItem("UserName");
  const [idCami, setIdCami] = useState<string | null>(null);
  const [nameCami, setNameCami] = useState<string>("");


  useEffect(() => {
    fetch(`http://localhost:8080/cami/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIdCami(data.id || null);
        setNameCami(data.name || "");
        setProduct(data);
        fetchImage(selectedType, selectedColor);
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id, selectedType, selectedColor]);

  const fetchImage = (type: string, color: string) => {
    const fetchUrl =
      type === "manga-corta"
        ? `http://localhost:8080/colorCami/getColor?name=${color}`
        : type === "sin-mangas"
        ? `http://localhost:8080/colorSinMangas/getColor?name=${color}`
        : `http://localhost:8080/colorMangaLarga/getColor?name=${color}`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => setColorProduct(data))
      .catch((error) => console.error("Error fetching color image:", error));
  };

  useEffect(() => {
    if (!canvasRef.current || !product || !colorProduct) return;

    const canvas = new fabric.Canvas(canvasRef.current);

    const addImagesToCanvas = async () => {
      try {
        const [baseImage, camiImage] = await Promise.all([
          fabric.FabricImage.fromURL(
            `data:image/png;base64,${product.imagen1}`
          ),
          fabric.FabricImage.fromURL(
            `data:image/png;base64,${colorProduct.imagenDelantera}`
          ),
        ]);

        baseImage.set({
          top: 190,
          left: 235,
          scaleX: 0.25,
          scaleY: 0.25,
          selectable: true,
        });

        camiImage.set({
          top: 0,
          left: 20,
          selectable: false,
          hasControls: true,
        });

        canvas.add(camiImage);
        canvas.add(baseImage);
        canvas.renderAll();
      } catch (error) {
        console.error("Error loading images into canvas:", error);
      }
    };

    addImagesToCanvas();

    return () => {
      canvas.dispose();
    };
  }, [product, colorProduct]);

  const saveAndAddToCart = () => {
    if (!canvasRef.current) return;

    const userId = localStorage.getItem("UserId");
    if (!userId) {
      console.error("No UserId found in localStorage");
      return;
    }

    const canvas = canvasRef.current;

    const imageBase64 = canvas.toDataURL("image/png");

    const cartItem = {
      productId: id,
      userId: parseInt(userId),
      image: imageBase64,
      type: selectedType,
      color: selectedColor,
      id_cami: idCami,
      name: nameCami,
    };

    fetch(`http://localhost:8080/cartItem/user/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product added to My Designs:", data);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  const makeItReal = () => {
    if (!canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL("image/png");
  
    const userId = localStorage.getItem("UserId"); // Obtener UserId si existe
  
    // Crear el objeto cartItem dinámicamente
    const cartItem = {
      productId: id,
      image: imageBase64,
      type: selectedType,
      color: selectedColor,
      id_cami: idCami,
      name: nameCami,
      ...(userId && { userId: parseInt(userId) }), // Solo agregar userId si existe
    };
  
    fetch(`http://localhost:8080/cartItem/uuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add product to cart.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Product added to My Designs:", data);
  

        // Redirigir a /pre-cart pasando el ID capturado
        window.location.href = `/pre-cart?id=${data.id}`;
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  const handleStayDesigning = () => {
    setIsModalOpen(false);
    console.log("Quedarse diseñando");
  };

  const handleGoToMyDesigns = () => {
    setIsModalOpen(false);
    window.location.href = "/my-designs";
  };

  return (
    <div className="details-container">
      <div className="details-content">
        <aside className="details-aside">
          <label htmlFor="type-select">Tipo de Camiseta: </label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="dropdown"
          >
            <option value="manga-corta">Manga Corta</option>
            <option value="sin-mangas">Sin Mangas</option>
            <option value="manga-larga">Manga Larga</option>
          </select>

          <label htmlFor="color-select">Color: </label>
          <select
            id="color-select"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="dropdown"
          >
            <option value="negro">Negro</option>
            <option value="blanco">Blanco</option>
          </select>
          {userName && (
            <button className="custom-button" onClick={saveAndAddToCart}>
              Guardar Diseño
            </button>
          )}
          <button className="d-button" onClick={makeItReal}>
            Hacerlo Realidad
          </button>
        </aside>

        <div className="details-canvas">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="canvas-style"
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            message="¡Producto añadido a Mis Diseños!"
            onConfirm={handleGoToMyDesigns}
            onCancel={handleStayDesigning}
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
