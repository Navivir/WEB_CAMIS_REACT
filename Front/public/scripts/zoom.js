export class ImageZoom {
    constructor(imageElement) {
        this.imageElement = imageElement;
        this.modal = null;
        this.modalContent = null;
        this.zoomImage = null;
        this.closeButton = null;
        this.zoomInButton = null;
        this.zoomOutButton = null;
        this.zoomLevel = 1; // Nivel de zoom inicial
        this.currentX = 0;  // Posición X actual de la imagen
        this.currentY = 0;  // Posición Y actual de la imagen

        this.initZoom();
    }

    initZoom() {
        this.createModal();
        this.addOpenEvent();
        this.addCloseEvents();
        this.addDragEvents(); // Agrega los eventos para arrastrar la imagen
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.style.display = 'none'; // Ocultar por defecto
    
        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';
    
        this.closeButton = document.createElement('span');
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = '&times;';
    
        this.zoomImage = document.createElement('img');
        this.zoomImage.id = 'zoom-image';
    
        // Crear botones de zoom
        this.zoomInButton = document.createElement('button');
        this.zoomInButton.className = 'zoom-in-button';
        this.zoomInButton.innerText = '+';
    
        this.zoomOutButton = document.createElement('button');
        this.zoomOutButton.className = 'zoom-out-button';
        this.zoomOutButton.innerText = '-';
    
        // Añadir la imagen al contenido del modal
        this.modalContent.appendChild(this.zoomImage);
    
        // Añadir el contenido del modal y los botones al modal
        this.modal.appendChild(this.modalContent);
        this.modal.appendChild(this.closeButton); // Añadir el botón de cerrar fuera de modalContent
        this.modal.appendChild(this.zoomInButton);
        this.modal.appendChild(this.zoomOutButton);
    
        document.body.appendChild(this.modal);
    
        // Añadir eventos a los botones de zoom
        this.addZoomEvents();
    }
    

    addCloseEvents() {
        this.closeButton.removeEventListener('click', this.closeModalHandler);

        this.closeModalHandler = this.closeModal.bind(this);
        this.closeButton.addEventListener('click', this.closeModalHandler);

        this.modalClickHandler = (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        };
        this.modal.addEventListener('click', this.modalClickHandler);
    }

    addOpenEvent() {
        this.imageElement.removeEventListener('click', this.openModalHandler);

        this.openModalHandler = this.openModal.bind(this);
        this.imageElement.addEventListener('click', this.openModalHandler);
    }

    openModal() {
        this.zoomImage.src = this.imageElement.src;
        this.zoomLevel = 1;
        this.currentX = 0;  // Restablecer la posición X
        this.currentY = 0;  // Restablecer la posición Y
        this.updateImageTransform();
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    updateImage(newImageElement) {
        this.imageElement = newImageElement;
        this.addOpenEvent();
    }

    addZoomEvents() {
        this.zoomInButton.addEventListener('click', () => this.zoomImageFunc(1.1)); // Aumenta el zoom en un 10%
        this.zoomOutButton.addEventListener('click', () => this.zoomImageFunc(0.9)); // Disminuye el zoom en un 10%
    }

    zoomImageFunc(factor) {
        const newZoomLevel = this.zoomLevel * factor;

        // Permitir zoom out hasta el nivel 1x (mínimo)
        if (newZoomLevel >= 1 && newZoomLevel <= 3) { // Limita el zoom entre 1x y 3x
            this.zoomLevel = newZoomLevel;
            this.updateImageTransform();
        }
    }

    addDragEvents() {
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        this.zoomImage.addEventListener('mousedown', (event) => {
            isDragging = true;
            startX = event.clientX - this.currentX;
            startY = event.clientY - this.currentY;
            this.zoomImage.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (event) => {
            if (isDragging) {
                this.currentX = event.clientX - startX;
                this.currentY = event.clientY - startY;
                this.updateImageTransform();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            this.zoomImage.style.cursor = 'grab';
        });
    }

    updateImageTransform() {
        this.zoomImage.style.transform = `scale(${this.zoomLevel}) translate(${this.currentX}px, ${this.currentY}px)`;
    }
}
