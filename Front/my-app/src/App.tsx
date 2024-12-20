import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';
import { useState } from "react";
import './App.css';
import { NavbarW } from './components/navbar/Navbar';
import { FooterW } from './components/footer/Footer';
import { User } from './scripts/Types';

function App() {
  const [user, setUser] = useState<User | null>(null); 
  
    const handleUserUpdate = (updatedUser : User) => {
      // Lógica para actualizar el usuario
      setUser(updatedUser);
    };
  
  return (
    <Router>
      <NavbarW />
        <Navigation user={user} onUserUpdate={handleUserUpdate}  />
      <FooterW />
    </Router>
  );
}

export default App;
