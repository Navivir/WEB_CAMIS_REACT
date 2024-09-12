import { getUserId } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userId = getUserId();
    if (!userId) {
        alert('No se ha encontrado un usuario logueado.');
        window.location.href = 'login.html';
        return;
    }

    const profileForm = document.getElementById('profileForm');

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
