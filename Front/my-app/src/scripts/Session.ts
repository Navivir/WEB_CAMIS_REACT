const GenerateToken = async () => {
  try {
    const response = await fetch("http://localhost:8080/users/generate-token");
    const token = await response.text();
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("authToken");
  return token !== null && token !== "";
};

async function isValidToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8080/users/is-valid-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Si el servidor responde con 200 OK, el token es válido
    if (response.status === 200) {
      return true;
    }

    // Si el servidor responde con cualquier otro código, el token no es válido
    return false;
  } catch (error) {
    console.error("Error validating token:", error);
    return false; // Si ocurre un error en la conexión o la solicitud
  }
}

async function getUserById(id:number): Promise<any | null> {
  try {
    const response = await fetch(`http://localhost:8080/users/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error(`Error fetching user. Status: ${response.status}`);
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export { GenerateToken, isLoggedIn, isValidToken, getUserById };
