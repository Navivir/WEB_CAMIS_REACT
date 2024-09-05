document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');

    console.log('userId:', userId);

    if (userId) {
        fetch(`http://localhost:8080/cart/${userId}`)
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
                                window.location.href = `details.html?id=${item.id_cami}&userId=${userId}`;
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
                                fetch(`http://localhost:8080/cart/${userId}/items/${item.id}`, {
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
                                fetch(`http://localhost:8080/cart/${userId}/items/${item.id}?quantity=${newQuantity}`, {
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
        console.error('No se pudo recuperar el userId.');
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
