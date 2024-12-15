import * as fabric from "fabric";

// Clase para manejar el canvas de fabric
export class CanvasManager {
  private canvas: fabric.Canvas | null = null;

  constructor(canvasRef: HTMLCanvasElement | null) {
    if (canvasRef) {
      this.canvas = new fabric.Canvas(canvasRef);
    }
  }

  // Función para agregar imágenes al canvas
  public addImagesToCanvas(productImage: string, colorImage: string) {
    if (!this.canvas) {
      console.error("Canvas is not initialized");
      return;
    }

    const addImages = async () => {
      try {
        const [baseImage, camiImage] = await Promise.all([
          fabric.FabricImage.fromURL(`data:image/png;base64,${productImage}`),
          fabric.FabricImage.fromURL(`data:image/png;base64,${colorImage}`),
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

        // Usamos el encadenamiento opcional para asegurarnos de que canvas no sea null
        this.canvas?.add(camiImage);
        this.canvas?.add(baseImage);
        this.canvas?.renderAll();
      } catch (error) {
        console.error("Error loading images into canvas:", error);
      }
    };

    addImages();
  }

  // Función para guardar la imagen del canvas en base64
  public saveToBase64() {
    return this.canvas ? this.canvas.toDataURL({ format: "png", multiplier: 1 }) : null;
  }

  // Función para limpiar el canvas
  public clearCanvas() {
    this.canvas?.clear();
  }

  // Función para eliminar el canvas cuando se desmonte
  public disposeCanvas() {
    this.canvas?.dispose();
  }
}
