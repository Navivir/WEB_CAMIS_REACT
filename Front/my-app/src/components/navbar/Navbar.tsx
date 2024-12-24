import { Navbar, Dropdown } from "flowbite-react";
import logo from "../../logos/camiB.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from '../../scripts/Types';


export function NavbarW(){
  const [user, setUser] = useState<User | null>(null);
  const userName = localStorage.getItem("UserName");
  const userId = localStorage.getItem("UserId");

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("UserId");
    localStorage.removeItem("UserName");
    navigate("/login");
  };

  return (
    <Navbar fluid rounded className="bg-gray-800">
      {/* Navbar Branding */}
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          UniqTee
        </span>
      </Navbar.Brand>

      {/* Navbar Options Dropdown */}
      <div className="flex md:order-2">
        <Dropdown label="Opciones" dismissOnClick={false}>
          {userName &&
            user && ( // Verifica que el usuario y la información estén disponibles
              <Dropdown.Item as={Link} to='/profile'>
                <div className="flex items-center">
                  {/* Mostrar la imagen de perfil */}
                  {user.imagenPerfil && (
                    <img
                      src={`data:image/jpeg;base64,${user.imagenPerfil}`} // Utilizar la cadena base64 directamente
                      alt="Imagen de perfil"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  {/* Mostrar el nombre del usuario */}
                  {user.username}
                </div>
              </Dropdown.Item>
            )}
          {userName && (
            <Dropdown.Item as={Link} to="/my-designs">
              Mis Diseños
            </Dropdown.Item>
          )}
          {!userName && (
            <Dropdown.Item as={Link} to="/login">
              Iniciar Sesión
            </Dropdown.Item>
          )}
          {!userName && (
            <Dropdown.Item as={Link} to="/sign-up">
              Registrarse
            </Dropdown.Item>
          )}
          <Dropdown.Item as={Link} to="/cart">
            Carrito
          </Dropdown.Item>
          {userName && (
            <Dropdown.Item as="button" onClick={handleLogout}>
              Cerrar sesión
            </Dropdown.Item>
          )}
        </Dropdown>
        <Navbar.Toggle />
      </div>

      {/* Navbar Links */}
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} to="/about">
          About
        </Navbar.Link>
        <Navbar.Link as={Link} to="/services">
          Services
        </Navbar.Link>
        <Navbar.Link as={Link} to="/pricing">
          Pricing
        </Navbar.Link>
        <Navbar.Link as={Link} to="/contact">
          Contact
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}