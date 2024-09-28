import {isLoggedIn, logout, updateUsername, getUserId } from './session.js'; 

document.addEventListener('DOMContentLoaded', async () => {
    const userId = getUserId();
    const token = localStorage.getItem('sessionToken');

    console.log('token:', token);

    const profileLink = document.getElementById('profile-icono');
    const profileDropdown = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
    const profileUsername = document.getElementById('profile-username');
    const MailForm = document.getElementById('contact-form');
   
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
            // Cargar datos del usuario
        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`);
            if (response.ok) {
                const userData = await response.json();

                // Mostrar los datos del usuario en los campos de entrada
                MailForm.name.value = userData.name;
                MailForm.email.value = userData.email;
                // Hacer los campos "nombre" y "email" no modificables
                MailForm.name.setAttribute('readonly', true);
                MailForm.email.setAttribute('readonly', true);
            } else {
                alert('Error al cargar los datos del usuario.');
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    }else {
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
});

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    fetch('http://localhost:8080/mail/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
          // Si el mensaje se envió correctamente, borra los campos "subject" y "message"
          if (result === 'Message sent successfully!') {
            this.subject.value = '';
            this.message.value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send message.');
    });
});



