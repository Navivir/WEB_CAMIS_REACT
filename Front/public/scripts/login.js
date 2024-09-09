import { saveToken } from './session.js'; 

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
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { token, userId } = await response.json();
                saveToken(token, userId, 6); // Guardar el token y el userID con expiración de 6 horas
                window.location.href = 'index.html'; // Redirigir al inicio
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error durante el login:', error);
        }
    });
});