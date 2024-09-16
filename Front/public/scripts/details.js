import { getToken, getUserId, isLoggedIn, logout, updateUsername } from './session.js'; // Importar la función desde session.js
import { ImageZoom } from './zoom.js'; // Importar la clase de zoom

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const camiId = urlParams.get('id');
    const token = getToken(); // Obtener el ID de usuario usando getUserId
    const userId = getUserId();

    const profileLink = document.getElementById('profile-icono');
    const profileDropdown = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
    const profileUsername = document.getElementById('profile-username');
   
    // Asegurarse de que el dropdown esté oculto al cargar la página
    profileDropdown.style.display = 'none';

    // Control de la imagen si está logueado o no
    if (isLoggedIn()) {
        // Si está logueado, mostrar el menú desplegable al hacer clic
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });
        await updateUsername();
    } else {
        // Si no está logueado, redirigir a login.html al hacer clic en la imagen
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'login.html'; // Redirige a la página de login
        });
    }

    // Ocultar el menú desplegable si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (!profileLink.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            logout(); // Llama a la función de logout para cerrar sesión
        });
    }

    if (camiId) {
        fetch(`http://localhost:8080/cami/${camiId}`)
            .then(response => response.json())
            .then(cami => {
                const container = document.getElementById('detalle-container');
                if (!container) {
                    console.error('El contenedor de detalles no se encontró en el DOM.');
                    return;
                }

                if (container.querySelector('.detalle-card')) {
                    console.log('Los detalles de la camiseta ya están cargados.');
                    return;
                }

                const camiCard = document.createElement('div');
                camiCard.className = 'detalle-card';

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

                    new ImageZoom(imgElement); // Aplicar zoom a la imagen

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
                            zoomInstance.updateImage(imgElement);
                        });

                        rightArrow.addEventListener('click', (event) => {
                            event.stopPropagation();
                            currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
                            imgElement.src = images[currentImageIndex];
                            zoomInstance.updateImage(imgElement);
                        });
                    }
                }

                const detailsContainer = document.createElement('div');
                detailsContainer.className = 'details-container';

                const title = document.createElement('h2');
                title.innerText = cami.name || 'Nombre no disponible';
                detailsContainer.appendChild(title);

                const material = document.createElement('p');
                material.innerText = `Material: ${cami.material || 'No especificado'}`;
                detailsContainer.appendChild(material);

                const price = document.createElement('p');
                const dPrice = document.createElement('p');
                if (cami.discount > 0) { // Corregir la condición de descuento
                    const originalPrice = cami.price.toFixed(2);     
                    price.innerHTML = `Precio: <span class="original-price">${originalPrice} €`;                  
                    const discountedPrice = (cami.price - (cami.price * (cami.discount / 100))).toFixed(2);
                    dPrice.innerHTML = `Precio con Descuento: <span class="discounted-price">${discountedPrice} €`
                    const discountLabel = document.createElement('div');
                    discountLabel.className = 'discount-label';
                    discountLabel.textContent = `-${cami.discount}%`;
                    detailsContainer.appendChild(discountLabel);
                } else {
                    price.innerText = `Precio: ${cami.price.toFixed(2)} €`;
                }
                detailsContainer.appendChild(price);
                detailsContainer.appendChild(dPrice);
                let sizeSelect;
                if (Array.isArray(cami.sizes) && cami.sizes.length > 0) {
                    const sizeLabel = document.createElement('label');
                    sizeLabel.innerText = 'Tamaño:';
                    detailsContainer.appendChild(sizeLabel);

                    sizeSelect = document.createElement('select');
                    cami.sizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size;
                        option.innerText = size;
                        sizeSelect.appendChild(option);
                    });
                    detailsContainer.appendChild(sizeSelect);
                }

                let colorSelect;
                if (Array.isArray(cami.colors) && cami.colors.length > 0) {
                    const colorLabel = document.createElement('label');
                    colorLabel.innerText = 'Color:';
                    detailsContainer.appendChild(colorLabel);

                    colorSelect = document.createElement('select');
                    cami.colors.forEach(color => {
                        const option = document.createElement('option');
                        option.value = color;
                        option.innerText = color;
                        colorSelect.appendChild(option);
                    });
                    detailsContainer.appendChild(colorSelect);
                }

                const quantityLabel = document.createElement('label');
                quantityLabel.innerText = 'Cantidad:';
                detailsContainer.appendChild(quantityLabel);

                const quantitySelect = document.createElement('select');
                for (let i = 1; i <= 10; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.innerText = i;
                    quantitySelect.appendChild(option);
                }
                detailsContainer.appendChild(quantitySelect);

                const description = document.createElement('p');
                description.innerText = cami.description || 'Descripción no disponible';
                detailsContainer.appendChild(description);

                const addToCartButton = document.createElement('button');
                addToCartButton.className = 'add-to-cart-button';
                addToCartButton.innerText = 'Añadir al carrito';
                detailsContainer.appendChild(addToCartButton);

                addToCartButton.addEventListener('click', () => {
                    const selectedSize = sizeSelect ? sizeSelect.value : '';
                    const selectedColor = colorSelect ? colorSelect.value : '';
                    const selectedQuantity = quantitySelect ? quantitySelect.value : 1;

                    const cartItem = {
                        name: cami.name,
                        size: selectedSize,
                        color: selectedColor,
                        price: cami.price,
                        quantity: parseInt(selectedQuantity, 10),
                        image: cami.imagen1,
                        id_cami: cami.id,
                        discount: cami.discount
                    };

                    // Verifica si el usuario está logueado
                    let endpoint;
                    if (isLoggedIn() && userId) {
                        // Usuario logueado, utiliza el endpoint con userId
                        endpoint = `http://localhost:8080/cart/${token}/${userId}`;
                    } else {
                        // Usuario no logueado, utiliza el endpoint sin userId
                        endpoint = `http://localhost:8080/cart/${token}`;
                    }

                    fetch(endpoint, { // Usa el endpoint adecuado basado en el estado de login
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(cartItem)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Respuesta del servidor:', data);
                        window.location.href = 'cart.html'; // Redirigir al carrito
                    })
                    .catch(error => {
                        console.error('Error al enviar los datos al carrito:', error);
                    });
                });

                camiCard.appendChild(detailsContainer);
                container.appendChild(camiCard);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {
        console.error('No se proporcionó un ID de camiseta válido en la URL.');
    }
    
});