import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Details from './pages/details/Details';
import { LoginPage } from './pages/login/Login';
import { SignUpPage } from './pages/signup/SignUp';
import MyDesigns from './pages/my-designs/MyDesigns';
import PreCart from './pages/preCart/PreCart';
import Cart from "./pages/cart/Cart"


     
const Navigation = () => {
  return (
    <Routes>
      {/* Navegación general sin restricciones */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

       
      {/* Ruta para Detalle de producto y diseños*/}
      <Route path="/details/:id" element={<Details />} />
      <Route path="/my-designs" element={<MyDesigns />} />
      <Route path="/pre-cart" element={<PreCart />} />
      <Route path="/cart" element={<Cart />} />
      
      {/* Navegación para carrito y checkout sin restricciones */}
      {/* <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} /> */}

      {/* Navegación de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
};

export default Navigation;