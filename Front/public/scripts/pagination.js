export class Paginator {
    constructor(itemsPerPage, container, fetchCamisetas, paginationContainerId) {
        this.itemsPerPage = itemsPerPage;
        this.container = container;
        this.fetchCamisetas = fetchCamisetas;
        this.currentPage = 1; // Página inicial
        this.totalItems = 0;
        this.totalPages = 0;
        this.query = ''; // Nueva propiedad para almacenar el término de búsqueda
        this.paginationContainer = document.getElementById(paginationContainerId); // Usar el contenedor específico

        this.init(); // Llamada a init en el constructor
    }

    init() {
        this.createPaginationControls();
        this.fetchData(); // Cargar la primera página de datos
    }

    setSearchQuery(query) {
        this.query = query;
        this.currentPage = 1; // Reiniciar a la primera página al cambiar la búsqueda
        this.fetchData(); // Cargar la primera página con el nuevo término de búsqueda
    }

    createPaginationControls() {
        this.paginationContainer.innerHTML = '';
        this.paginationContainer.className = 'pagination';
    }

    updateControls() {
        this.paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.totalPages = totalPages;

        const pageButtonsContainer = document.createElement('div');
        pageButtonsContainer.className = 'page-buttons-container';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.className = 'pagination-button';
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
        this.paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = 'pagination-button';
            button.classList.toggle('active', i === this.currentPage);
            button.addEventListener('click', () => this.changePage(i));
            pageButtonsContainer.appendChild(button);
        }
        this.paginationContainer.appendChild(pageButtonsContainer);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.className = 'pagination-button';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));
        this.paginationContainer.appendChild(nextButton);
    }

    changePage(page) {
        this.currentPage = page;
        this.fetchData();
    }

    fetchData() {
        this.fetchCamisetas(this.currentPage - 1, this.itemsPerPage, this.query)
            .then(data => {
                this.setData(data);
                this.render();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    render() {
        const items = this.data.items;
    
        // Limpia el contenedor
        this.container.innerHTML = '';
    
        items.forEach(cami => {
            const camiCard = document.createElement('div');
            camiCard.className = 'cami-card';
    
            // Manejar las imágenes
            const images = [];
            if (cami.imagen1) {
                images.push(`data:image/jpeg;base64,${cami.imagen1}`);
            }
            if (cami.imagen2) {
                images.push(`data:image/jpeg;base64,${cami.imagen2}`);
            }
    
            let currentImageIndex = 0;
    
            if (images.length > 0) {
                const imgElement = document.createElement('img');
                imgElement.src = images[currentImageIndex];
                camiCard.appendChild(imgElement);
    
                // Añadir las flechas para cambiar de imagen si hay más de una
                if (images.length > 1) {
                    const leftArrow = document.createElement('button');
                    leftArrow.className = 'arrow left';
                    leftArrow.innerHTML = '&#9664;';
                    camiCard.appendChild(leftArrow);
    
                    const rightArrow = document.createElement('button');
                    rightArrow.className = 'arrow right';
                    rightArrow.innerHTML = '&#9654;';
                    camiCard.appendChild(rightArrow);
    
                    leftArrow.addEventListener('click', (event) => {
                        event.stopPropagation();
                        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
                        imgElement.src = images[currentImageIndex];
                    });
    
                    rightArrow.addEventListener('click', (event) => {
                        event.stopPropagation();
                        currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
                        imgElement.src = images[currentImageIndex];
                    });
                }
            }
    
            // Añadir el nombre de la camiseta
            const title = document.createElement('h3');
            title.textContent = cami.name || 'Nombre no disponible';
            camiCard.appendChild(title);
    
            // Añadir precios
            const originalPrice = document.createElement('p');
            originalPrice.className = 'original-price';
            originalPrice.textContent = `${cami.price.toFixed(2)} €`;
    
            if (cami.discount) {
                // Si hay descuento, añade la clase 'with-discount'
                originalPrice.classList.add('with-discount');
    
                // Calcular y mostrar el precio con descuento
                const discountedPrice = document.createElement('p');
                discountedPrice.className = 'discounted-price';
                const calculatedPrice = cami.price - (cami.price * (cami.discount / 100));
                discountedPrice.textContent = `${calculatedPrice.toFixed(2)} €`;
                camiCard.appendChild(discountedPrice);
            
                // Calcular y mostrar la etiqueta de descuento
                const discountLabel = document.createElement('div');
                discountLabel.className = 'discount-label';
                discountLabel.textContent = `-${Math.round(cami.discount)}%`;
                camiCard.appendChild(discountLabel);
            } else {
                // Si no hay descuento, añade la clase 'no-discount'
                originalPrice.classList.add('no-discount');
            }
    
            camiCard.appendChild(originalPrice);
    
            // Añadir un espacio visual
            const spacer = document.createElement('p');
            spacer.className = 'spacer';
            camiCard.appendChild(spacer);
    
            // Configurar el evento click para redirigir a los detalles
            camiCard.addEventListener('click', () => {
                window.location.href = `details.html?id=${cami.id}`;
            });
    
            // Añadir la tarjeta al contenedor
            this.container.appendChild(camiCard);
        });
    
        this.updateControls();
    }
    

    setData(data) {
        this.data = data;
        this.totalItems = data.totalItems;
        this.updateControls();
    }
}
