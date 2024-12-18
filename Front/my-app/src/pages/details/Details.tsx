import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useParams } from "react-router-dom";
import "./Details.css";
import Modal from "../../components/modal/Modal";
import ImageRadioButton from "../../components/imageRadioButton/ImageRadioButton";
import camiseta from "../../logos/camiseta.png";
import sin_mangas from "../../logos/camiseta-sin-mangas.png";
import manga_larga from "../../logos/manga-larga.png";
import ImageRadioButtonColor from "../../components/imageRadioButtonColor/ImageRadioButtonColor";
import blanco from "../../logos/blanco.png";
import negro from "../../logos/negro.png";
import saveIcon from "../../logos/disquete.png";
import nextIcon from "../../logos/next.png";
import { isLoggedIn } from "../../scripts/Session";

interface Product {
  imagen1: string;
  imagenDelantera: string;
}
const typeOptions = [
  {
    src: camiseta,
    alt: "",
    value: "manga-corta",
  },
  {
    src: sin_mangas,
    alt: "",
    value: "sin-mangas",
  },
  {
    src: manga_larga,
    alt: "",
    value: "manga-larga",
  },
];

const typeOptionColor = [
  {
    src: negro,
    alt: "",
    value: "negro",
  },
  {
    src: blanco,
    alt: "",
    value: "blanco",
  },
];

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [colorProduct, setColorProduct] = useState<Product | null>(null);
  const [selectedType, setSelectedType] = useState<string>("manga-corta");
  const [selectedColor, setSelectedColor] = useState<string>("negro");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [button1Message, setbutton1Message] = useState<string>("");
  const [button2Message, setbutton2Message] = useState<string>("");
  const [idCami, setIdCami] = useState<string | null>(null);
  const [nameCami, setNameCami] = useState<string>("");
  console.log(selectedType);
  console.log(selectedColor);

  useEffect(() => {
    fetch(`http://localhost:8080/cami/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIdCami(data.id || null);
        setNameCami(data.name || "");
        setProduct(data);
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchImage(selectedType, selectedColor);
    }
  }, [selectedType, selectedColor, product]);

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
        // Definir el rectángulo que limita el área de movimiento
        const limitRect = new fabric.Rect({
          left: 150,
          top: 100,
          width: 300,
          height: 400,
          fill: "rgba(105, 103, 103, 0)",
          selectable: false,
          hasBorders: false,
          hasControls: false,
        });

        baseImage.set({
          top: 140,
          left: 240,
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
        canvas.add(limitRect);
        canvas.add(baseImage);

        // Escalar las imágenes antes de agregarlas al canvas
        //scaleImageToFixedWidth(baseImage, FIXED_WIDTH);

        // Función que limita el movimiento de la imagen base dentro del área
        canvas.on("object:moving", (e) => {
          const obj = e.target;

          // Limitar el movimiento de baseImage dentro del área del rectángulo
          if (obj === baseImage) {
            // Limitar el movimiento dentro del límite del rectángulo
            if (obj.left < limitRect.left) {
              obj.left = limitRect.left;
            }
            if (obj.top < limitRect.top) {
              obj.top = limitRect.top;
            }
            if (
              obj.left + obj.width * obj.scaleX >
              limitRect.left + limitRect.width
            ) {
              obj.left =
                limitRect.left + limitRect.width - obj.width * obj.scaleX;
            }
            if (
              obj.top + obj.height * obj.scaleY >
              limitRect.top + limitRect.height
            ) {
              obj.top =
                limitRect.top + limitRect.height - obj.height * obj.scaleY;
            }

            // Volver a renderizar el canvas para aplicar las restricciones
            canvas.renderAll();
          }
        });

        canvas.on("object:scaling", (e) => {
          const obj = e.target;
          //scaleImageToFixedWidth(baseImage, FIXED_WIDTH);
          // Limitar la escala de baseImage (solo la imagen base, puedes adaptar esto a otras imágenes si es necesario)
          if (obj === baseImage) {
            
            const minScale = 0.1; // Mínimo valor de escala
            const maxScale = 0.5; // Máximo valor de escala
        

            // Limitar la escala X y Y
            if (obj.scaleX < minScale) {
              obj.scaleX = minScale;
            }
            if (obj.scaleY < minScale) {
              obj.scaleY = minScale;
            }
            if (obj.scaleX > maxScale) {
              obj.scaleX = maxScale;
            }
            if (obj.scaleY > maxScale) {
              obj.scaleY = maxScale;
            }

            // Verificar que la imagen no salga del límite del canvas
            const canvasWidth = canvas.getWidth();
            const canvasHeight = canvas.getHeight();

            // Limitar la imagen dentro del canvas
            if (obj.left + obj.width * obj.scaleX > canvasWidth) {
              obj.left = canvasWidth - obj.width * obj.scaleX;
            }
            if (obj.top + obj.height * obj.scaleY > canvasHeight) {
              obj.top = canvasHeight - obj.height * obj.scaleY;
            }

            if (obj.left < 0) {
              obj.left = 0;
            }
            if (obj.top < 0) {
              obj.top = 0;
            }

            // Volver a renderizar el canvas para aplicar las restricciones de escala
            canvas.renderAll();
          }
        });
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
      setModalMessage(
        "¡Necesitas estar registrado para guardar tus diseños! Por favor, inicia sesión o regístrate para continuar."
      );
      setbutton1Message("Iniciar sesión");
      setbutton2Message("Seguir creando");
      setIsModalOpen(true);
      console.error("No UserId found in localStorage");
      return;
    } else {
      setModalMessage("¡Diseño añadido a tu lista!");
      setbutton1Message("Ver mis diseños");
      setbutton2Message("Seguir creando");
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
  };

  const handleGoToMyDesigns = () => {
    const isLogged = isLoggedIn();

    if (!isLogged) {
      window.location.href = "/login";
      setIsModalOpen(false);
    } else {
      window.location.href = "/my-designs";
      setIsModalOpen(false);
    }
  };

  return (
    <div className="details-container">
      <h2 className="details-h2">Crea tu propio Diseño</h2>
      <div className="details-content">
        <aside className="details-aside">
          <div className="image-radio-group">
            <label htmlFor="type-select-label">Tipo de Camiseta: </label>
            <ImageRadioButton
              images={typeOptions}
              name="shirtType"
              onChange={(value) => setSelectedType(value)}
              selectedValue={selectedType}
            />
          </div>

          <div className="image-radio-group-color">
            <label htmlFor="color-select-label">Color: </label>
            <ImageRadioButtonColor
              images={typeOptionColor}
              name="colorType"
              selectedValue={selectedColor}
              onChange={(value) => setSelectedColor(value)}
            />
          </div>

          <div className="button-container-details">
            <button className="custom-button" onClick={saveAndAddToCart}>
              <img
                src={saveIcon}
                alt="Guardar"
                className="button-icon-details"
              />
            </button>

            <button className="d-button" onClick={makeItReal}>
              <img
                src={nextIcon}
                alt="Siguiente"
                className="button-icon-details"
              />
            </button>
          </div>
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
            message={modalMessage}
            onConfirm={handleGoToMyDesigns}
            onCancel={handleStayDesigning}
            confirmButtonText={button1Message}
            cancelButtonText={button2Message}
            confirmButtonColor="#4CAF50"
            cancelButtonColor="#5494de"
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
