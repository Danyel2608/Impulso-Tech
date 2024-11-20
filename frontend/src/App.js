import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importa BrowserRouter
import Home from "./Views/Home/Home";
import Login from "./Views/Login/Login";
import SignUp from "./Views/SignUp/SignUp";
import LoadingIndicator from "./Views/UI/Spinners/LoadingIndicator";
import ConfirmEmail from "./Views/ConfirmMail/ConfirmMail";
import NewsletterPage from "./Views/Newsletter/NewsletterPage";
import ProductsPage from "./Views/Products/ProductsPage";
import ProductGenerator from "./GenerarDatos";
import Adidas from "./Views/Sections/Marcas/Adidas";
import Supreme from "./Views/Sections/Marcas/Supreme";
import Vans from "./Views/Sections/Marcas/Vans";
import Puma from "./Views/Sections/Marcas/Puma";
import ForgetPassword from "./Views/ForgetPassword/ForgetPassword";
import Nike from "./Views/Sections/Marcas/Nike";
import Niño from "./Views/Sections/Categorias/Niño";
import Hombre from "./Views/Sections/Categorias/Hombre";
import Mujer from "./Views/Sections/Categorias/Mujer";
import Accesorios from "./Views/Sections/Accesorios/Accesorios";
import Novedades from "./Views/Sections/Novedades/Novedades";
import Rebajas from "./Views/Sections/Rebajas/Rebajas";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // Verificar si hay un token almacenado en el localStorage al cargar la aplicación
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Función para establecer el token al iniciar sesión
  const handleLogin = (token, role) => {
    setToken(token);
    setRole(role);
    // Almacenar el token en el localStorage para que persista después de recargar la página
    localStorage.setItem("token", token);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setToken(null); // Eliminar el token al cerrar sesión
    // Limpiar el token del localStorage al cerrar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return (
    <div className="App">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/confirmar" element={<ConfirmEmail />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/generar" element={<ProductGenerator />} />
            <Route path="/nike" element={<Nike />} />
            <Route path="/adidas" element={<Adidas />} />
            <Route path="/supreme" element={<Supreme />} />
            <Route path="/vans" element={<Vans />} />
            <Route path="/puma" element={<Puma />} />
            <Route path="/forget" element={<ForgetPassword />} />
            <Route path="/niño" element={<Niño />}></Route>
            <Route path="/hombre" element={<Hombre />}></Route>
            <Route path="/mujer" element={<Mujer />}></Route>
            <Route path="/accesorios" element={<Accesorios />}></Route>
            <Route path="/novedades" element={<Novedades />}></Route>
            <Route path="/rebajas" element={<Rebajas />}></Route>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
