import * as fabric from "fabric";

export class CanvasManager {
  private canvas: fabric.Canvas;
  private baseImage: fabric.Image | null = null;
  private camiImage: fabric.Image | null = null;
  private limitRect: fabric.Rect | null = null;
  private static instance: CanvasManager | null = null;
  private static instances = new Map<HTMLCanvasElement, CanvasManager>();

  constructor(private canvasElement: HTMLCanvasElement | null) {
    if (!canvasElement) {
      throw new Error("No se proporcionó un elemento canvas válido.");
    }
    this.canvas = new fabric.Canvas(canvasElement);
  }

  static getInstance(canvas: HTMLCanvasElement): CanvasManager {
    if (!CanvasManager.instance) {
      CanvasManager.instance = new CanvasManager(canvas);
    }
    return CanvasManager.instance;
  }
  static createInstance(canvasElement: HTMLCanvasElement): CanvasManager {
    if (CanvasManager.instances.has(canvasElement)) {
      const existingInstance = CanvasManager.instances.get(canvasElement);
      if (existingInstance) {
        return existingInstance;
      }
    }

    const newInstance = new CanvasManager(canvasElement);
    CanvasManager.instances.set(canvasElement, newInstance);
    return newInstance;
  }

  static disposeInstance(canvasElement: HTMLCanvasElement) {
    const instance = CanvasManager.instances.get(canvasElement);
    if (instance) {
      instance.dispose();
      CanvasManager.instances.delete(canvasElement); // Elimina la referencia
    }
  }

  public initializeCanvas(canvasElement: HTMLCanvasElement) {
    if (this.canvas) return; // Si ya está inicializado, no lo reiniciamos

    this.canvas = new fabric.Canvas(canvasElement); // Crear la instancia de fabric.Canvas
  }

  // Método definido correctamente
  public async addImagesToCanvas(
    baseImageSrc: string,
    camiImageSrc: string,
    limitRectParams: {
      left: number;
      top: number;
      width: number;
      height: number;
    }
  ) {
    try {
      // Cargar las imágenes de manera asíncrona
      const [baseImage, camiImage] = await Promise.all([
        fabric.FabricImage.fromURL(baseImageSrc),
        fabric.FabricImage.fromURL(camiImageSrc),
      ]);

      // Crear el rectángulo límite con los parámetros proporcionados
      const limitRect = new fabric.Rect({
        left: limitRectParams.left,
        top: limitRectParams.top,
        width: limitRectParams.width,
        height: limitRectParams.height,
        fill: "rgba(105, 103, 103, 0)", // Relleno transparente
        selectable: false,
        hasBorders: false,
        hasControls: false,
      });

      // Establecer las propiedades de las imágenes
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

      // Agregar las imágenes y el rectángulo al canvas
      this.canvas.add(camiImage);
      this.canvas.add(limitRect);
      this.canvas.add(baseImage);

      // Función para limitar el movimiento de la imagen base dentro del área
      this.canvas.on("object:moving", (e) => {
        const obj = e.target;

        // Limitar el movimiento dentro del límite del rectángulo
        if (obj === baseImage) {
          if (obj.left < limitRect.left) obj.left = limitRect.left;
          if (obj.top < limitRect.top) obj.top = limitRect.top;
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
          this.canvas.renderAll();
        }
      });

      // Función para limitar la escala de la imagen base
      this.canvas.on("object:scaling", (e) => {
        const obj = e.target;

        if (obj === baseImage) {
          const minScale = 0.1;
          const maxScale = 0.5;

          // Limitar la escala X y Y
          if (obj.scaleX < minScale) obj.scaleX = minScale;
          if (obj.scaleY < minScale) obj.scaleY = minScale;
          if (obj.scaleX > maxScale) obj.scaleX = maxScale;
          if (obj.scaleY > maxScale) obj.scaleY = maxScale;

          // Verificar que la imagen no salga del límite del canvas
          const canvasWidth = this.canvas.getWidth();
          const canvasHeight = this.canvas.getHeight();

          if (obj.left + obj.width * obj.scaleX > canvasWidth) {
            obj.left = canvasWidth - obj.width * obj.scaleX;
          }
          if (obj.top + obj.height * obj.scaleY > canvasHeight) {
            obj.top = canvasHeight - obj.height * obj.scaleY;
          }
          if (obj.left < 0) obj.left = 0;
          if (obj.top < 0) obj.top = 0;

          // Volver a renderizar el canvas para aplicar las restricciones de escala
          this.canvas.renderAll();
        }
      });
    } catch (error) {
      console.error("Error loading images into canvas:", error);
    }
  }

  // Libera los recursos asociados al canvas
  public dispose() {
    if (this.canvas) {
      this.canvas.clear();
      this.canvas.dispose();
      CanvasManager.instances.delete(
        this.canvas.getElement() as HTMLCanvasElement
      );
    }
  }

  public clearCanvas() {
    if (this.canvas) {
      this.canvas.clear(); // Elimina todos los objetos del canvas
    }
  }
}
