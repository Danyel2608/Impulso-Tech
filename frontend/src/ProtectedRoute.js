import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // Si el token no está presente, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si el token está presente, muestra el componente de la ruta protegida
  return element;
};

export default ProtectedRoute;
