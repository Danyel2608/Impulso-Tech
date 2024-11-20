// nike.js
import React from "react";
import Marca from "./Marcas"; // Importamos el componente Marca

function Nike() {
  return (
    <div>
      <Marca marca="Nike" /> {/* Pasamos "nike" como prop */}
    </div>
  );
}

export default Nike;
