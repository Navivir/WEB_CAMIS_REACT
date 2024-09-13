import { getUserId, isLoggedIn } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userId = getUserId();
    if (!userId) {
        alert('No se ha encontrado un usuario logueado.');
        window.location.href = 'login.html';
        return;
    }
    const changePasswordButton = document.getElementById('changePasswordButton');

    changePasswordButton.addEventListener('click', () => {
        window.location.href = 'change_password.html';
    });

    const profileForm = document.getElementById('profileForm');

    const profileLink = document.getElementById('profile-icono');
    const profileDropdown = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
   
    // Asegurarse de que el dropdown esté oculto al cargar la página
    profileDropdown.style.display = 'none';

    // Control de la imagen si está logueado o no
    if (isLoggedIn()) {
        // Si está logueado, mostrar el menú desplegable al hacer clic
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });
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

    // Cargar datos del usuario
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (response.ok) {
            const userData = await response.json();

            // Mostrar los datos del usuario en los campos de entrada
            profileForm.name.value = userData.name;
            profileForm.surname.value = userData.surname;
            profileForm.username.value = userData.username;
            profileForm.email.value = userData.email;
            profileForm.birthDate.value = userData.birthDate;
        } else {
            alert('Error al cargar los datos del usuario.');
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }

    // Guardar cambios
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedUser = {
            name: profileForm.name.value,
            surname: profileForm.surname.value,
            username: profileForm.username.value,
            email: profileForm.email.value,
            birthDate: profileForm.birthDate.value
        };

        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                alert('Datos actualizados correctamente.');
            } else {
                alert('Error al actualizar los datos.');
            }
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
        }
    });
});
