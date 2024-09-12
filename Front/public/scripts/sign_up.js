document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const toggleRepeatPassword = document.getElementById('toggleRepeatPassword');
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('repeatPassword');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Cambiar el ícono entre "ver" y "ocultar"
        togglePassword.src = type === 'password' ? 'images/ver.svg' : 'images/visto.svg'; o
    });

    toggleRepeatPassword.addEventListener('click', () => {
        const type = repeatPasswordInput.type === 'password' ? 'text' : 'password';
        repeatPasswordInput.type = type;
        toggleRepeatPassword.src = type === 'password' ? 'images/ver.svg' : 'images/visto.svg';
    });

    document.getElementById('signUpForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeatPassword').value;
        const birthDate = document.getElementById('birthDate').value;

        // Verificar si las contraseñas coinciden
        if (password !== repeatPassword) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        const userData = {
            name,
            surname,
            username,
            email,
            password,
            birthDate
        };

        try {
            const response = await fetch('http://localhost:8080/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Registro exitoso');
                window.location.href = 'login.html';
            } else {
                alert('Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
