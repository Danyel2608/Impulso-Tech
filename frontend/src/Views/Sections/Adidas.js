// Adidas.js
import React from "react";
import Marca from "./Marcas"; // Importamos el componente Marca

function Adidas() {
  return (
    <div>
      <Marca marca="adidas" /> {/* Pasamos "adidas" como prop */}
    </div>
  );
}

export default Adidas;
