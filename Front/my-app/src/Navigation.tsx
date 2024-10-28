import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Details from './pages/details/Details';

     
const Navigation = () => {
  return (
    <Routes>
      {/* Navegación general sin restricciones */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

       
      {/* Ruta para Detalle de producto */}
      <Route path="/details/:id" element={<Details />} />
      
      {/* Navegación para carrito y checkout sin restricciones */}
      {/* <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} /> */}

      {/* Navegación de autenticación */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> */}
    </Routes>
  );
};

export default Navigation;