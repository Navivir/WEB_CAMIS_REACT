// session.js
const USER_ID_KEY = 'userId';

// Generar un ID de sesión aleatorio (o usar uno existente)
function generateUserId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Obtener el userId desde el almacenamiento local o generarlo
function getUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

// Exportar la función para usarla en otros archivos
export { getUserId };