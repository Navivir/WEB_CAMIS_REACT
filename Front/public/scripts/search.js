import { getUserId } from './session.js';

// Añade el event listener cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const userId = getUserId(); // Obtener el userId

    // Añadir listener para la tecla Enter
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchCamisetas(userId); // Llama a la función cuando se presiona Enter
        }
    });

    // Añadir listener para el botón de búsqueda
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchCamisetas(userId); // Llama a la función cuando se presiona el botón
        });
    }
});

// Función para buscar camisetas
export function searchCamisetas(userId, page = 0, limit = 10) {
    const query = document.getElementById('search-input').value.trim();

    // Si el campo de búsqueda está vacío, usa el endpoint general
    const url = query === ''
        ? `http://localhost:8080/camis_page?page=${page}&limit=${limit}`
        : `http://localhost:8080/camis/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('cami-container');
            if (!container) {
                console.error('Contenedor para los resultados no encontrado.');
                return;
            }
            container.innerHTML = '';

            const camisetas = Array.isArray(data.content) ? data.content : [];

            if (camisetas.length === 0) {
                container.innerHTML = '<p>No se encontraron resultados.</p>';
                return;
            }

            camisetas.forEach(cami => {
                const camiCard = document.createElement('div');
                camiCard.className = 'cami-card';

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

                const title = document.createElement('h3');
                title.innerText = cami.name || 'Nombre no disponible';
                camiCard.appendChild(title);

                const spacer = document.createElement('p');
                spacer.className = 'spacer';
                camiCard.appendChild(spacer);

                camiCard.addEventListener('click', () => {
                    window.location.href = `details.html?id=${cami.id}&userId=${userId}`;
                });

                container.appendChild(camiCard);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
