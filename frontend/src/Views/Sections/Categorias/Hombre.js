// Hombre.js
import React from "react";
import Categoria from "./Categoria"; // Importamos el componente Marca

function Hombre() {
  return (
    <div>
      <Categoria categoria="hombre" /> {/* Pasamos "Hombre" como prop */}
    </div>
  );
}

export default Hombre;
