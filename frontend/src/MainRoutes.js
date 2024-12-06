import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./Views/Home/Home";
import Login from "./Views/Login/Login";
import SignUp from "./Views/SignUp/SignUp";
import LoadingIndicator from "./Views/UI/Spinners/LoadingIndicator";
import ConfirmEmail from "./Views/ConfirmMail/ConfirmMail";
import NewsletterPage from "./Views/Newsletter/NewsletterPage";
import ProductsPage from "./Views/Products/ProductsPage";
import ProductGenerator from "./utils/GenerarDatos";
import Adidas from "./Views/Sections/Marcas/Adidas";
import Supreme from "./Views/Sections/Marcas/Supreme";
import Vans from "./Views/Sections/Marcas/Vans";
import Puma from "./Views/Sections/Marcas/Puma";
import Nike from "./Views/Sections/Marcas/Nike";
import Niño from "./Views/Sections/Categorias/Niño";
import Hombre from "./Views/Sections/Categorias/Hombre";
import Mujer from "./Views/Sections/Categorias/Mujer";
import Accesorios from "./Views/Sections/Accesorios/Accesorios";
import Novedades from "./Views/Sections/Novedades/Novedades";
import Rebajas from "./Views/Sections/Rebajas/Rebajas";
import NotFound from "./NotFound";
import ForgetPassword from "./Views/ForgetPassword/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "./Views/Admin/AdminPage";

function MainRoutes() {
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");

    // Si no hay un idioma almacenado, lo establecemos en "en"
    if (!storedLanguage) {
      localStorage.setItem("language", "en");
    }

    setIsRouteLoading(true);
    const timer = setTimeout(() => setIsRouteLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location]);

  if (isRouteLoading) {
    return <LoadingIndicator />;
  }

  const handleLogin = (token, role) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  return (
    <Routes>
      {/* Ruta Principal */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={<ProtectedRoute element={<Login onLogin={handleLogin} />} />}
      />
      <Route
        path="/sign-up"
        element={<ProtectedRoute element={<SignUp />} />}
      />
      <Route path="/admin" element={<AdminPage />}></Route>
      <Route path="/forget" element={<ForgetPassword />} />
      <Route path="/confirmar" element={<ConfirmEmail />} />
      <Route path="/newsletter" element={<NewsletterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/generar" element={<ProductGenerator />} />
      {/* Rutas agrupadas bajo /marcas */}
      <Route path="/marcas">
        <Route path="nike" element={<Nike />} />
        <Route path="adidas" element={<Adidas />} />
        <Route path="supreme" element={<Supreme />} />
        <Route path="vans" element={<Vans />} />
        <Route path="puma" element={<Puma />} />
      </Route>
      {/* Rutas agrupadas bajo /categorias */}
      <Route path="/categorias">
        <Route path="niño" element={<Niño />} />
        <Route path="hombre" element={<Hombre />} />
        <Route path="mujer" element={<Mujer />} />
      </Route>
      <Route path="accesorios" element={<Accesorios />} />
      <Route path="novedades" element={<Novedades />} />
      <Route path="rebajas" element={<Rebajas />} />
      <Route path="generar" element={<ProductGenerator />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default MainRoutes;
