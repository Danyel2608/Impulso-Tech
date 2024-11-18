// Puma.js
import React from "react";
import Marca from "./Marcas"; // Importamos el componente Marca

function Puma() {
  return (
    <div>
      <Marca marca="puma" /> {/* Pasamos "puma" como prop */}
    </div>
  );
}

export default Puma;
