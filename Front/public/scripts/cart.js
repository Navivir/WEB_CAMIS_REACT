import {isLoggedIn, logout, updateUsername } from './session.js'; 

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('sessionToken');

    console.log('token:', token);

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

    if (token) {
        fetch(`http://localhost:8080/cart/${token}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al recuperar el carrito');
                }
                return response.json();
            })
            .then(cartItems => {
                console.log('Datos del carrito:', cartItems);

                const container = document.getElementById('cart-container');
                if (!container) {
                    console.error('El contenedor del carrito no se encontró en el DOM.');
                    return;
                }

                // Limpiar el contenedor
                container.innerHTML = '';

                if (Array.isArray(cartItems) && cartItems.length > 0) {
                    let total = 0;

                    cartItems.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'cart-item-card';

                        if (item.image) {
                            const imgElement = document.createElement('img');
                            imgElement.src = `data:image/jpeg;base64,${item.image}`;
                            imgElement.alt = item.name;
                            imgElement.className = 'cart-item-image';
                            itemDiv.appendChild(imgElement);

                            imgElement.addEventListener('click', () => {
                                window.location.href = `details.html?id=${item.id_cami}&token=${token}`;
                            });
                        }

                        const detailsDiv = document.createElement('div');
                        detailsDiv.className = 'item-details';

                        const title = document.createElement('h3');
                        title.innerText = item.name;
                        detailsDiv.appendChild(title);

                        const size = document.createElement('p');
                        size.innerText = `Tamaño: ${item.size}`;
                        detailsDiv.appendChild(size);

                        const color = document.createElement('p');
                        color.innerText = `Color: ${item.color}`;
                        detailsDiv.appendChild(color);

                        const price = document.createElement('p');
                        price.className = 'item-price';

                        // Calcula el precio con descuento
                        const originalPrice = item.price.toFixed(2);
                        const discountedPrice = (item.price - (item.price * (item.discount / 100))).toFixed(2);

                        if (item.discount) {
                            price.innerHTML = `
                                Precio: <span class="original-price">${originalPrice} €</span> 
                                <span class="discounted-price">${discountedPrice} €</span>
                            `
                            const discountLabel = document.createElement('div');
                            discountLabel.className = 'discount-label';
                            discountLabel.textContent = `-${item.discount}%`;
                            detailsDiv.appendChild(discountLabel);;
                        } else {
                            price.innerText = `Precio: ${originalPrice} €`;
                        }
                        

                        detailsDiv.appendChild(price);

                        const quantityDiv = document.createElement('div');
                        quantityDiv.className = 'item-quantity';

                        const quantityLabel = document.createElement('label');
                        quantityLabel.innerText = 'Cantidad: ';
                        quantityDiv.appendChild(quantityLabel);

                        const quantitySelect = document.createElement('select');
                        for (let i = 1; i <= 10; i++) {
                            const option = document.createElement('option');
                            option.value = i;
                            option.text = i;
                            if (i === item.quantity) {
                                option.selected = true;
                            }
                            quantitySelect.appendChild(option);
                        }
                        quantityDiv.appendChild(quantitySelect);
                        detailsDiv.appendChild(quantityDiv);

                        const deleteButton = document.createElement('button');
                        deleteButton.className = 'delete-button';

                        const trashIcon = document.createElement('img');
                        trashIcon.src = '../images/papelera.svg';
                        trashIcon.alt = 'Eliminar';
                        trashIcon.style.width = '24px';
                        trashIcon.style.height = '24px';

                        deleteButton.appendChild(trashIcon);
                        itemDiv.appendChild(deleteButton);
                        itemDiv.appendChild(detailsDiv);

                        container.appendChild(itemDiv);

                        deleteButton.addEventListener('click', () => {
                            if (confirm('¿Estás seguro de que quieres eliminar este ítem del carrito?')) {
                                fetch(`http://localhost:8080/cart/${token}/items/${item.id}`, {
                                    method: 'DELETE',
                                })
                                .then(response => {
                                    if (response.ok) {
                                        container.removeChild(itemDiv);
                                        cartItems = cartItems.filter(ci => ci.id !== item.id);
                                        updateTotal(cartItems);
                                    } else {
                                        throw new Error('Error al eliminar el ítem del carrito');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error al eliminar el ítem:', error);
                                });
                            }
                        });

                        quantitySelect.addEventListener('change', () => {
                            const newQuantity = parseInt(quantitySelect.value, 10);
                            if (confirm('¿Estás seguro de que quieres actualizar la cantidad?')) {
                                fetch(`http://localhost:8080/cart/${token}/items/${item.id}?quantity=${newQuantity}`, {
                                    method: 'PUT',
                                })
                                .then(response => {
                                    if (response.ok) {
                                        console.log('Cantidad actualizada correctamente');
                                        item.quantity = newQuantity;
                                        updateTotal(cartItems);
                                    } else {
                                        throw new Error('Error al actualizar la cantidad del ítem');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error al actualizar la cantidad:', error);
                                });
                            }
                        });

                        // Sumar el total con el descuento aplicado
                        const itemTotal = item.discount ? discountedPrice * item.quantity : item.price * item.quantity;
                        total += parseFloat(itemTotal);
                    });

                    // Añadir tarjeta del total y botón de checkout
                    addTotalAndCheckout(container, total);
                } else {
                    const emptyMessage = document.createElement('p');
                    emptyMessage.className = 'empty-cart';
                    emptyMessage.innerText = 'Tu carrito está vacío.';
                    container.appendChild(emptyMessage);
                }
            })
            .catch(error => {
                console.error('Error al cargar los datos del carrito:', error);
            });
    } else {
        console.error('No se pudo recuperar el token.');
    }
});

// Función para actualizar el total y volver a añadir el botón de checkout
function updateTotal(cartItems) {
    const container = document.getElementById('cart-container');
    if (!container) {
        console.error('El contenedor del carrito no se encontró en el DOM.');
        return;
    }

    let total = 0;
    cartItems.forEach(item => {
        const itemTotal = item.discount ? (item.price - (item.price * (item.discount / 100))) * item.quantity : item.price * item.quantity;
        total += itemTotal;
    });

    // Eliminar total y botón de checkout existentes si existen
    const existingTotalCard = document.querySelector('.total-card');
    if (existingTotalCard) {
        container.removeChild(existingTotalCard);
    }
    const existingCheckoutButton = document.querySelector('.checkout-button');
    if (existingCheckoutButton) {
        container.removeChild(existingCheckoutButton);
    }

    // Añadir tarjeta del total y botón de checkout
    addTotalAndCheckout(container, total);
}

// Función para añadir el total del carrito y el botón de checkout
function addTotalAndCheckout(container, total) {
    const totalCard = document.createElement('div');
    totalCard.className = 'total-card';
    totalCard.innerHTML = `
        <h4>Total del carrito:</h4>
        <p>${total.toFixed(2)} &euro;</p>
    `;
    container.appendChild(totalCard);

    const checkoutButton = document.createElement('button');
    checkoutButton.className = 'checkout-button';
    checkoutButton.innerText = 'Proceder a la pasarela de pago';
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
    container.appendChild(checkoutButton);
}
