import React, { useEffect, useRef, useState } from "react";
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
import { CanvasManager } from "../../fabric/CanvasManager";
import { resizeImage } from "../../scripts/Utils";


interface Product {
  imagen1: string;
  imagenDelantera: string;
  imagenTrasera: string;
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
  const canvasManagerRef = useRef<CanvasManager | null>(null);
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
  const [currentView, setCurrentView] = useState<"delantera" | "trasera">(
    "delantera"
  );
  const [appliedImages, setAppliedImages] = useState<{
    delantera?: string;
    trasera?: string;
  }>({});
  const [isEditableDelantera, setIsEditableDelantera] = useState(true);
  const [isEditableTrasera, setIsEditableTrasera] = useState(true);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imagenUsadaFrontal, setImagenUsadaFrontal] = useState<string>("");
  const [imagenUsadaTrasera, setImagenUsadaTrasera] = useState<string>("");
  const [image2Add, setImage2Add] = useState<string>("");

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
      .then((data) => {
        // Asumimos que data tiene las imágenes 'delantera' y 'trasera'
        setColorProduct(data);

        // Actualiza las imágenes en el estado
        setImages([`data:image/png;base64,${data.imagenDelantera}`,`data:image/png;base64,${data.imagenTrasera}`]);
      })
      .catch((error) => console.error("Error fetching color image:", error));
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!canvasManagerRef.current) {
      canvasManagerRef.current = CanvasManager.createInstance(
        canvasRef.current
      );
    }

    return () => {
      if (canvasManagerRef.current) {
        canvasManagerRef.current.dispose();
        canvasManagerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasManagerRef.current || !product || !colorProduct) return;

    canvasManagerRef.current.clearCanvas();
    if (imagenUsadaFrontal || imagenUsadaTrasera){

    }
    const baseImageSrc = newImage || `data:image/png;base64,${product.imagen1}`;
    const camiImageSrc =
      currentView === "delantera"
        ? `data:image/png;base64,${colorProduct.imagenDelantera}`
        : `data:image/png;base64,${colorProduct.imagenTrasera}`;

    const limitRectParams =
      currentView === "delantera"
        ? { left: 150, top: 100, width: 300, height: 400 }
        : { left: 200, top: 150, width: 250, height: 350 };

    if (currentView === "delantera" && imagenUsadaFrontal) {
      canvasManagerRef.current.addImagesToCanvas(
        imagenUsadaFrontal,
        camiImageSrc,
        limitRectParams
      );
    }

    if (currentView === "trasera" && imagenUsadaTrasera) {
      canvasManagerRef.current.addImagesToCanvas(
        imagenUsadaTrasera,
        camiImageSrc,
        limitRectParams
      );
    } 

    if (currentView === "delantera" && !imagenUsadaFrontal){
      setImage2Add(baseImageSrc)
      canvasManagerRef.current.addImagesToCanvas(
        baseImageSrc,
        camiImageSrc,
        limitRectParams
      );
    }

    if (currentView === "trasera" && !imagenUsadaTrasera){
      setImage2Add(baseImageSrc)
      canvasManagerRef.current.addImagesToCanvas(
        baseImageSrc,
        camiImageSrc,
        limitRectParams
      );
    }

  }, [
    newImage,
    currentView,
    product,
    colorProduct,
    imagenUsadaFrontal,
    imagenUsadaTrasera
  
  ]);

  const saveAndAddToCart = () => {

    if (isEditableDelantera && isEditableTrasera) {
      setModalMessage("Debes aplicar imágenes antes de guardar.");
      setbutton1Message("");  // Oculta el botón si está vacio
      setbutton2Message("Aceptar");
      setIsModalOpen(true);
      return;
    }

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


    const cartItem = {
      productId: id,
      userId: parseInt(userId),
      images: images,
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

    const userId = localStorage.getItem("UserId");

    // Crear el objeto cartItem dinámicamente
    const cartItem = {
      productId: id,
      images: images,
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

  const handleApply = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const appliedImage = canvas.toDataURL();
    
    setAppliedImages((prev) => ({
      ...prev,
      [currentView]: appliedImage, // Guarda la imagen aplicada para la vista actual
    }));

    if (currentView === "delantera") {
      setIsEditableDelantera(false);
      
      if(imagenUsadaFrontal){
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[0] = appliedImage;
          return newImages;
        });
      } else{
      setImagenUsadaFrontal(image2Add)
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[0] = appliedImage;
        return newImages;   
      });
      }

    } else {
      setIsEditableTrasera(false);
      if(imagenUsadaTrasera){
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[1] = appliedImage;
        return newImages;
      });
    } else {
      setImagenUsadaTrasera(image2Add);
       setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[1] = appliedImage;
        return newImages;
      });
      
      
    }
    }
  };

  const handleViewChange = (view: "delantera" | "trasera") => {
    if (appliedImages[view]) {
      // Si la imagen está aplicada, no mostrar el canvas
      setCurrentView(view);
      return;
    }

    // Cambiar a la vista seleccionada
    setCurrentView(view);

    // Permitir edición solo si no hay imagen aplicada
    if (view === "delantera") {
      setIsEditableDelantera(true);
    } else {
      setIsEditableTrasera(true);
    }
  };

  const handleEdit = () => {
    setAppliedImages((prev) => ({
      ...prev,
      [currentView]: undefined, // Eliminar la imagen aplicada para la vista actual
    }));

    if (currentView === "delantera") {
      setIsEditableDelantera(true);
      setImagenUsadaFrontal(imagenUsadaFrontal)
    } else {
      setIsEditableTrasera(true);
      setImagenUsadaTrasera(imagenUsadaTrasera)
    }

    if (canvasRef.current) {
      canvasRef.current.style.display = "block";
    }
  };

  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const resizedImage = await resizeImage(file, 500);
      setNewImage(resizedImage);
  
      if (currentView === "delantera") {
        setImagenUsadaFrontal(resizedImage);
      } else {
        setImagenUsadaTrasera(resizedImage);
      }
  
      if (canvasRef.current) {
        canvasRef.current.style.display = "block";
      }
    } catch (error) {
      console.error('Error al redimensionar la imagen:', error);
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
              disabled={!isEditableDelantera || !isEditableTrasera} // Deshabilitar si cualquiera es false
            />
          </div>

          <div className="image-radio-group-color">
            <label htmlFor="color-select-label">Color: </label>
            <ImageRadioButtonColor
              images={typeOptionColor}
              name="colorType"
              selectedValue={selectedColor}
              onChange={(value) => setSelectedColor(value)}
              disabled={!isEditableDelantera || !isEditableTrasera} // Deshabilitar si cualquiera es false
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
        <div className="container-canvas-selector">
          <div className="details-canvas">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="canvas-style"
              style={{
                display: !appliedImages[currentView] ? "block" : "none",
              }}
            />
            <img
              src={appliedImages[currentView] || ""}
              alt={
                currentView === "delantera"
                  ? "Vista delantera"
                  : "Vista trasera"
              }
              className="applied-image"
              style={{
                display: appliedImages[currentView] ? "block" : "none",
              }}
            />
          </div>

          <div className="view-selector">
            <button
              className={`view-button ${
                currentView === "delantera" ? "active" : ""
              }`}
              onClick={() => handleViewChange("delantera")}
            >
              <img
                src={
                  appliedImages.delantera
                    ? appliedImages.delantera
                    : `data:image/png;base64,${colorProduct?.imagenDelantera}`
                }
                alt="Delantera"
              />
            </button>
            <button
              className={`view-button ${
                currentView === "trasera" ? "active" : ""
              }`}
              onClick={() => handleViewChange("trasera")}
            >
              <img
                src={
                  appliedImages.trasera
                    ? appliedImages.trasera
                    : `data:image/png;base64,${colorProduct?.imagenTrasera}`
                }
                alt="Trasera"
              />
            </button>
          </div>
          <div className="container-buttons-edit-aply-details">
            {appliedImages[currentView] ? (
              <button
                className="edit-button-details"
                onClick={handleEdit}
                disabled={!appliedImages[currentView]} // Deshabilitar si no hay imagen aplicada
              >
                Editar
              </button>
            ) : (
              <button
                className="apply-button-details"
                onClick={handleApply}
                disabled={
                  !!appliedImages[currentView] || // Deshabilitar si la imagen ya está aplicada
                  (currentView === "delantera" && !isEditableDelantera) ||
                  (currentView === "trasera" && !isEditableTrasera)
                }
              >
                Aplicar
              </button>
            )}

            {!appliedImages[currentView] && ( // Mostrar el botón solo si no hay imagen aplicada
              <label htmlFor="upload-image" className="upload-button-details">
                Cambiar Imagen
                <input
                  type="file"
                  id="upload-image"
                  accept="image/*"
                  onChange={handleAddImage}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
          onConfirm={handleGoToMyDesigns}
          onCancel={handleStayDesigning}
          confirmButtonText={button1Message || ""}
          cancelButtonText={button2Message || ""}
          confirmButtonColor="#4CAF50"
          cancelButtonColor="#5494de"
        />
      </div>
    </div>
  );
};

export default Details;
