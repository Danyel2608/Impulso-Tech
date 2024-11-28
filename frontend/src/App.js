import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Facturación from "./Views/Facturación/Facturacion";
import ProtectedRoute from "./ProtectedRoute";
import UserHome from "./Views/UserHome/UserHome";
import NotFound from "./NotFound";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="App">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Ruta Principal */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/sign-up" element={<SignUp />} />
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

            {/* Rutas protegidas */}
            <Route
              path="/invoice"
              element={<ProtectedRoute element={<Facturación />} />}
            />
            <Route
              path="/userHome"
              element={<ProtectedRoute element={<UserHome />} />}
            />

            {/* Ruta comodín para rutas no definidas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
