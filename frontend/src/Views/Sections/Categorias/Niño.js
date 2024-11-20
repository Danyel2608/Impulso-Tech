// Niño.js
import React from "react";
import Categoria from "./Categoria"; // Importamos el componente Marca

function Niño() {
  return (
    <div>
      <Categoria categoria="niño" /> {/* Pasamos "Niño" como prop */}
    </div>
  );
}

export default Niño;
