"use client";

import { Button, Navbar } from "flowbite-react";
import logo from '../../camiB.svg';
import { Link } from 'react-router-dom';

export function NavbarW() {
  return (
    <Navbar fluid rounded className="bg-gray-800">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">UniqTee</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button>See Our Products</Button>
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