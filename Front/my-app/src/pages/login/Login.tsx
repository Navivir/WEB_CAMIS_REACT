import React, { useState } from "react";
import "./Login.css";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");  // State para el email
  const [password, setPassword] = useState<string>("");  // State para la contraseña
  const [showPassword, setShowPassword] = useState<boolean>(false);  // Para mostrar/ocultar la contraseña

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Evita que el formulario recargue la página

    // Datos para el login (como el objeto que proporcionaste)
    const loginData = {
      email: email,  
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Indicamos que estamos enviando datos JSON
        },
        body: JSON.stringify(loginData),  // Convertimos el objeto a JSON
      });

      if (!response.ok) {
        throw new Error("Login failed");  // Si la respuesta no es OK, lanzamos un error
      }

      const data = await response.json();  // Si es exitoso, obtenemos la respuesta como JSON
      console.log("Login successful:", data);

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("UserId", data.userId);
      localStorage.setItem("UserName", data.userName);
      
      window.location.href = "/home";  // Redirigimos a la página Home
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please check your credentials.");  // Si hay error, mostramos mensaje de fallo
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label htmlFor="email">Your email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado del email
            required
          />
        </div>
        <div className="form-group password-group">
          <label htmlFor="password">Your password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Actualiza el estado de la contraseña
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>
        <div className="signup">
          <a href="/sign-up" className="sign-up-link">
            SignUp
          </a>
        </div>
        <div className="form-remember">
          <a href="/forgot-password" className="forgot-password-link">
            Forgot your password?
          </a>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};
