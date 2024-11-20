// Mujer.js
import React from "react";
import Categoria from "./Categoria"; // Importamos el componente Marca

function Mujer() {
  return (
    <div>
      <Categoria categoria="mujer" /> {/* Pasamos "Mujer" como prop */}
    </div>
  );
}

export default Mujer;
