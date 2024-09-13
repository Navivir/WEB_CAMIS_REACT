import { getUserId, isLoggedIn } from './session.js';

document.addEventListener("DOMContentLoaded", () => {

    const userId = getUserId();
  
    const passwordResetForm = document.getElementById('passwordResetForm');
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const toggleOldPassword = document.getElementById('toggleOldPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

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

    // Mostrar/ocultar contraseña antigua
    toggleOldPassword.addEventListener('click', () => {
        const type = oldPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        oldPasswordInput.setAttribute('type', type);       
        // Cambiar el ícono entre "ver" y "ocultar"
        toggleOldPassword.src = type === 'password' ? 'images/ver.svg' : 'images/visto.svg'; 
    });

    toggleNewPassword.addEventListener('click', () => {
        const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        newPasswordInput.setAttribute('type', type);
        toggleNewPassword.src = type === 'password' ? 'images/ver.svg' : 'images/visto.svg'; 

    });

    toggleConfirmPassword.addEventListener('click', () => {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        toggleConfirmPassword.src = type === 'password' ? 'images/ver.svg' : 'images/visto.svg'; 
    });

    // Lógica de validación y envío del formulario
    passwordResetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validar si las contraseñas coinciden
        if (newPassword !== confirmPassword) {
            alert('La nueva contraseña y la repetida no coinciden');a
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            if (response.ok) {
                alert('Contraseña actualizada exitosamente');
            } else {
                alert('Error al actualizar la contraseña. Verifica que la antigua contraseña sea correcta.');
            }
        } catch (error) {
            alert('Hubo un problema con la solicitud. Intenta nuevamente más tarde.');
            console.error('Error:', error);
        }
    });
});
