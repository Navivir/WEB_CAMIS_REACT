import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useParams } from "react-router-dom";
import "./Details.css";

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
  const [selectedSize, setSelectedSize] = useState<string>("M"); // Estado para la talla
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // Estado para la cantidad

  useEffect(() => {
    fetch(`http://localhost:8080/cami/${id}`)
      .then((response) => response.json())
      .then((data) => {
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
          fabric.Image.fromURL(`data:image/png;base64,${product.imagen1}`),
          fabric.Image.fromURL(
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

  return (
      <div className="details-container">
        <div className="details-content">
          <aside className="details-aside">
            {/* Dropdown para tipo */}
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

            {/* Dropdown para color */}
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

            {/* Dropdown para talla */}
            <label htmlFor="size-select">Talla: </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="dropdown"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            {/* Dropdown para cantidad */}
            <label htmlFor="quantity-select">Cantidad: </label>
            <select
              id="quantity-select"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
              className="dropdown"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </aside>

          <div className="details-canvas">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="canvas-style"
            />
          </div>
        </div>
      </div>
  );
};

export default Details;
