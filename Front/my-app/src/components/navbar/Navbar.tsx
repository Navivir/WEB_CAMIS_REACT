"use client";

import { Navbar, Dropdown } from "flowbite-react";
import logo from "../../logos/camiB.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 



export function NavbarW() {

  // Obtener el nombre del usuario desde localStorage
  const userName = localStorage.getItem("UserName");

  const navigate = useNavigate();

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
          {userName && (   // condición
          <Dropdown.Item disabled>{userName} </Dropdown.Item>
          )}
          {userName && (   // condición
          <Dropdown.Item as={Link} to="/my-designs">Mis Diseños</Dropdown.Item>
          )}
          {!userName && ( 
          <Dropdown.Item as={Link} to="/login">Iniciar Sesión</Dropdown.Item>
          )}
          {!userName && ( 
          <Dropdown.Item as={Link} to="/sign-up">Registrarse</Dropdown.Item>
          )}
          <Dropdown.Item as={Link} to="/cart">Carrito</Dropdown.Item> 
          {userName && (         
          <Dropdown.Item as="button" onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
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
