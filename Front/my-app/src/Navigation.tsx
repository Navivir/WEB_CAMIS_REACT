import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Details from './pages/details/Details';
import { LoginPage } from './pages/login/Login';
import { SignUpPage } from './pages/signup/SignUp';
import MyDesigns from './pages/my-designs/MyDesigns';
import PreCart from './pages/preCart/PreCart';
import Cart from "./pages/cart/Cart"
import { UserProfile } from './pages/my-profile/UserProfile';
import { User } from './scripts/Types';

// Definir tipos explícitos para las props
interface NavigationProps {
  user: User | null; // Tipando user como User o null
  onUserUpdate: (updatedUser: User) => void; // Tipando la función onUserUpdate
}

const Navigation: React.FC<NavigationProps> = ({ user, onUserUpdate }) => {
  return (
    <Routes>
      {/* Navegación general sin restricciones */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

      {/* Ruta para Detalle de producto y diseños */}
      <Route path="/details/:id" element={<Details />} />
      <Route path="/my-designs" element={<MyDesigns />} />
      <Route path="/pre-cart" element={<PreCart />} />
      <Route path="/cart" element={<Cart />} />

      {/* Navegación de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Ruta de perfil con las props necesarias */}
      <Route
        path="/profile"
        element={<UserProfile user={user} onUserUpdate={onUserUpdate} />}
      />
    </Routes>
  );
};

export default Navigation;