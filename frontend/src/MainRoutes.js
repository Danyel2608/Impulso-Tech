import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh-token") || ""
  );

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

  // Función para refrescar el token
  const refreshTokenUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Si no hay refresh token, el usuario necesita iniciar sesión de nuevo
      alert("Tiene que iniciar sesión de nuevo")
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/auth/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${token}`, // Usamos el refresh token en el encabezado
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Si la respuesta es exitosa, actualizamos el token de acceso
        console.log(data);
        localStorage.setItem("token", data.data.token);
        console.log("Token de acceso renovado");
      } else {
        console.error("No se pudo renovar el token", data.error);
        // Si no se pudo renovar el token, probablemente el refresh token ha expirado
        // Aquí puedes redirigir al usuario a la pantalla de inicio de sesión
      }
    } catch (error) {
      console.error("Error al intentar refrescar el token:", error);
    }
  };

  // Configurar el intervalo para refrescar el token cada 14 minutos
  useEffect(() => {
    // Solo refrescar el token si el usuario tiene un token de acceso
    if (token) {
      const interval = setInterval(() => {
        refreshTokenUser(); // Llamamos a la función para refrescar el token
      }, 14 * 60 * 1000); // 14 minutos en milisegundos

      return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [token]); // Solo cuando el token cambia

  if (isRouteLoading) {
    return <LoadingIndicator />;
  }

  const handleLogin = (token, refreshToken, role) => {
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem("token", token);
    localStorage.setItem("refresh-token", refreshToken);
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
