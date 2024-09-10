const TOKEN_KEY = 'sessionToken';
const EXPIRATION_KEY = 'tokenExpiration';
const USER_ID = 'userId';

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

    // Verificar si el token es válido y no ha expirado
    if (token && expiration && new Date() < new Date(expiration)) {
        return token;
    } else {
        // Token ha expirado o no existe, generar uno nuevo
        const newToken = generateToken();

        // Verificar si el usuario está logueado
        const expirationHours = isLoggedIn() ? 30 * 24 : 6; // 30 días para usuarios logueados, 6 horas para no logueados
        const expirationDate = getExpirationDate(expirationHours);

        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(EXPIRATION_KEY, expirationDate);

        return newToken;
    }
}
function getUserId() {
    return localStorage.getItem(USER_ID) || null; 
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

async function fetchTokenByUserId(userId) {
    try {
        const response = await fetch(`http://localhost:8080/cart/token/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const token = await response.text(); // Devuelve el token como texto
            console.log('Token recuperado para el usuario con ID:', userId, token);
            return token;
        } else {
            console.error('Error al recuperar el token del carrito:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error en fetchTokenByUserId:', error);
        return null;
    }
}

// Exportar la función para usarla en otros archivos
export { getToken, saveToken, isLoggedIn, logout, getUserId, fetchTokenByUserId};