import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';
import './App.css';
import { NavbarW } from './components/navbar/Navbar';
import { FooterW } from './components/footer/Footer';

function App() {
  return (
    <Router>
      <NavbarW />
        <Navigation />
      <FooterW />
    </Router>
  );
}

export default App;
