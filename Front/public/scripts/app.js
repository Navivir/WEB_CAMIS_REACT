import { getUserId } from './session.js';
import { searchCamisetas } from './search.js';
import { Paginator } from './pagination.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cami-container');
    const containerFeatured = document.getElementById('featured-container');
    const containerDiscounted = document.getElementById('discounted-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const userId = getUserId();

    if (!container) {
        console.error('Contenedor de camisetas no encontrado.');
        return;
    }

    const fetchCamisetas = (page, itemsPerPage, query = '') => {
        const url = query === ''
            ? `http://localhost:8080/camis_page?page=${page}&limit=${itemsPerPage}`
            : `http://localhost:8080/camis/search?q=${encodeURIComponent(query)}&page=${page}&limit=${itemsPerPage}`;
        
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                return {
                    items: data.content,
                    totalItems: data.totalElements
                };
            });
    };
    const fetchFeaturedCamisetas = (page, itemsPerPage) => {
        const url = `http://localhost:8080/featured?page=${page}&limit=${itemsPerPage}`;
        
     return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Verifica la estructura de los datos
        if (!data.content) {
            throw new Error("La respuesta de la API no tiene la estructura esperada.");
        }
        return {
            items: data.content,
            totalItems: data.totalElements
        };
    });
    };
    
    const fetchDiscountedCamisetas = (page, itemsPerPage) => {
        const url = `http://localhost:8080/discounted?page=${page}&limit=${itemsPerPage}`;
        
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                return {
                    items: data.content,
                    totalItems: data.totalElements
                };
            });
    };

    const paginator = new Paginator(10, container, fetchCamisetas, 'pagination-container');
    const paginatorFeatured = new Paginator(5, containerFeatured, fetchFeaturedCamisetas, 'featured-pagination-container');
    const paginatorDiscounted = new Paginator(5, containerDiscounted, fetchDiscountedCamisetas, 'discounted-pagination-container');


    // Asignar la función al botón de búsqueda
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            paginator.setSearchQuery(query); // Actualizar la búsqueda y reiniciar la paginación
        });
    }

    // Listener para la tecla Enter en el campo de búsqueda
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            paginator.setSearchQuery(query); // Actualizar la búsqueda y reiniciar la paginación
        }
    });

    // Inicializar la paginación cargando la primera página de datos
    paginator.fetchData();
    paginatorDiscounted.fetchData()
    paginatorFeatured.fetchData()
});
