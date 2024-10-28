import { Button, Navbar } from "flowbite-react";
import logo from '../../camiB.svg';
import profileIcon from '../../profileW.svg'; // Importa el ícono de perfil
import { Link } from 'react-router-dom';

export function NavbarW() {
  return (
    <Navbar fluid rounded className="bg-gray-800">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">UniqTee</span>
      </Navbar.Brand>
      <div className="flex items-center space-x-4 md:order-2">
        <Button>See Our Products</Button>
        
        {/* Enlace al perfil con ícono */}
        <Link to="/profile">
          <img src={profileIcon} alt="Profile" className="h-6 w-6" />
        </Link>
        
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/" active>Home</Navbar.Link>
        <Navbar.Link as={Link} to="/about">About</Navbar.Link>
        <Navbar.Link as={Link} to="/services">Services</Navbar.Link>
        <Navbar.Link as={Link} to="/pricing">Pricing</Navbar.Link>
        <Navbar.Link as={Link} to="/contact">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}