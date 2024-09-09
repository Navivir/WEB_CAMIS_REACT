const TOKEN_KEY = 'sessionToken';
const EXPIRATION_KEY = 'tokenExpiration';
const USER_ID = '';

// Generar un token de sesión aleatorio
function generateToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function saveToken(token, user_id, hours) {
    const expirationDate = getExpirationDate(hours);
    localStorage.setItem(TOKEN_KEY, token); 
    localStorage.setItem(EXPIRATION_KEY, expirationDate);
    localStorage.setItem(USER_ID, user_id) 
    console.log('Token guardado:', token, 'Usuario con ID: ', user_id,'Expira en:', expirationDate);
}

// Obtener la fecha y hora actual más un número de horas
function getExpirationDate(hours) {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    return now.toISOString();
}

// Obtener el token de sesión desde el almacenamiento local o generarlo
function getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiration = localStorage.getItem(EXPIRATION_KEY);

    if (token && expiration && new Date() < new Date(expiration)) {
        return token;
    } else {
        // Token ha expirado o no existe, generar uno nuevo
        const newToken = generateToken();
        const expirationDate = getExpirationDate(6); // Token expira en 6 horas

        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(EXPIRATION_KEY, expirationDate);

        return newToken;
    }
}

function isLoggedIn() {
    const token = localStorage.getItem(TOKEN_KEY);
    const expirationDate = localStorage.getItem(EXPIRATION_KEY);
    const userId = localStorage.getItem(USER_ID);

    if (!userId) {
        return false;
    }

    const now = new Date();
    const expiry = new Date(expirationDate);

    return now < expiry;
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    localStorage.removeItem(USER_ID);
    window.location.href = 'login.html'; // Redirige al login
}

// Exportar la función para usarla en otros archivos
export { getToken, saveToken, isLoggedIn, logout };