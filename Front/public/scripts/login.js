import { saveToken, fetchTokenByUserId, isLoggedIn } from './session.js';

document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Cambiar el ícono entre "ver" y "ocultar"
        togglePassword.src = type === 'password' ? 'images/ver.svg' : 'images/visto.svg'; // Cambia el ícono según el estado
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        const username = e.target.querySelector('input[type="text"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        try {
            // Verificar si ya existe un token válido antes de hacer el login
            if (isLoggedIn()) {
                // Si ya estás logueado, no hagas login de nuevo y usa el token actual
                console.log('Ya tienes una sesión activa con token:', getToken());
                window.location.href = 'index.html'; // Redirigir al inicio
                return; // Salir de la función para evitar sobrescribir el token
            }

            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { token, userId } = await response.json();
                
                // Verificar si ya existe un token para el usuario
                let tokenUser = await fetchTokenByUserId(userId);
                
                if (tokenUser != null ) {
                    // Si hay token existente, solicitarlo y guardarlo
                    saveToken(tokenUser, userId,30 * 24);
                } else {
                    // Si no hay token existente, solicitar uno nuevo al servidor y guardarlo
                    saveToken(token, userId,30 * 24); // Guardar el nuevo token
                }

                window.location.href = 'index.html'; // Redirigir al inicio
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error durante el login:', error);
        }
    });
});
