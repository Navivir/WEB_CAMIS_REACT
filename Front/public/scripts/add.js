import { getToken, isLoggedIn } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    const profileLink = document.getElementById('profile-icono');
    const profileDropdown = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');

    // Control de la imagen si está logueado o no
    if (isLoggedIn()) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });
    } else {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'login.html';
        });
    }

    window.addEventListener('click', (event) => {
        if (!profileLink.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }

    // Aquí comienza la creación del formulario para agregar un nuevo producto
    const container = document.getElementById('add-container');
    if (!container) {
        console.error('El contenedor de edición no se encontró en el DOM.');
        return;
    }

    const camiForm = document.createElement('form');
    camiForm.className = 'add-form';

    // Crear un contenedor para cada campo
    const createFieldContainer = (labelText, inputElement) => {
        const fieldContainer = document.createElement('div');
        fieldContainer.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.innerText = labelText;
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(inputElement);

        return fieldContainer;
    };

    // Input para el nombre
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Nombre del producto';
    camiForm.appendChild(createFieldContainer('Nombre:\n', nameInput));

    // Input para el material
    const materialInput = document.createElement('input');
    materialInput.type = 'text';
    materialInput.placeholder = 'Material';
    camiForm.appendChild(createFieldContainer('Material:\n', materialInput));

    // Input para el precio
    const priceInput = document.createElement('input');
    priceInput.type = 'decimal'; // Cambiado a 'number' para precios
    priceInput.placeholder = 'Precio';
    camiForm.appendChild(createFieldContainer('Precio:\n', priceInput));

    // Input para el descuento
    const discountInput = document.createElement('input');
    discountInput.type = 'number';
    discountInput.placeholder = 'Descuento';
    camiForm.appendChild(createFieldContainer('Descuento:\n', discountInput));

    // Tipos disponibles
    const tiposEnum = ['MANGA_CORTA', 'MANGA_LARGA', 'CORTE_MUJER', 'SIN_MANGAS', 'TIRANTES', 'JERSEY'];
    const selectTipo = document.createElement('select');

    // Crear las opciones del dropdown
    tiposEnum.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.innerText = tipo;
        selectTipo.appendChild(option);
    });
    camiForm.appendChild(createFieldContainer('Tipo:\n', selectTipo));

    // Checkboxes para tallas
    const sizesEnum = ['S', 'M', 'L', 'XL']; // Tallas disponibles
    const sizeContainer = document.createElement('div');
    sizesEnum.forEach(size => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = size;
        const label = document.createElement('label');
        label.innerText = size;
        sizeContainer.appendChild(checkbox);
        sizeContainer.appendChild(label);
        sizeContainer.appendChild(document.createElement('br'));
    });
    camiForm.appendChild(createFieldContainer('Tamaño:', sizeContainer));

    // Checkboxes para colores
    const colorsEnum = ['ROJO', 'VERDE', 'AZUL', 'NEGRO', 'BLANCO', 'AMARILLO', 
        'LILA', 'NARANJA', 'GRIS', 'ROSA'];
    const colorContainer = document.createElement('div');
    colorsEnum.forEach(color => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = color;
        const label = document.createElement('label');
        label.innerText = color;
        colorContainer.appendChild(checkbox);
        colorContainer.appendChild(label);
        colorContainer.appendChild(document.createElement('br'));
    });
    camiForm.appendChild(createFieldContainer('Colores:', colorContainer));

    // Textarea para la descripción
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.placeholder = 'Descripción del producto';
    camiForm.appendChild(createFieldContainer('Descripción:', descriptionTextarea));

    // Inputs para las imágenes
    const image1Input = document.createElement('input');
    image1Input.type = 'file';
    image1Input.accept = 'image/*';
    camiForm.appendChild(createFieldContainer('Imagen 1:', image1Input));

    const image2Input = document.createElement('input');
    image2Input.type = 'file';
    image2Input.accept = 'image/*';
    camiForm.appendChild(createFieldContainer('Imagen 2:', image2Input));

    // Checkbox para Featured
    const featuredCheckbox = document.createElement('input');
    featuredCheckbox.className = "custom-checkbox";
    featuredCheckbox.type = 'checkbox';
    camiForm.appendChild(createFieldContainer('Destacado:  ', featuredCheckbox));

    // Botón para guardar los cambios
    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.innerText = 'Agregar producto'; // Cambiar el texto del botón
    camiForm.appendChild(saveButton);

    // Añadir el formulario al contenedor
    container.appendChild(camiForm);

    // Manejar el envío del formulario
    camiForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', nameInput.value);
        formData.append('material', materialInput.value);
        formData.append('price', priceInput.value);
        formData.append('discount', discountInput.value);
        formData.append('description', descriptionTextarea.value);
        formData.append('imagen1', image1Input.files[0]);
        formData.append('imagen2', image2Input.files[0]);
        formData.append('featured', featuredCheckbox.checked ? 1 : 0);
        formData.append('type', selectTipo.value);
        
        // Recoger las tallas seleccionadas
        const selectedSizes = [];
        sizeContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                selectedSizes.push(checkbox.value);
            }
        });
        formData.append('sizes', selectedSizes.join(',')); // Guardar como string separado por comas

        // Recoger los colores seleccionados
        const selectedColors = [];
        colorContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                selectedColors.push(checkbox.value);
            }
        });
        formData.append('colors', selectedColors.join(',')); // Guardar como string separado por comas

        try {
            const createResponse = await fetch(`http://localhost:8080/cami`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            
            if (!createResponse.ok) {
                throw new Error('Error al agregar el producto');
            }
            alert('Producto agregado con éxito');
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    });
});
