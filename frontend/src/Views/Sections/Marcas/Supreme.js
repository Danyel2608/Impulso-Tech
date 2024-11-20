// Supreme.js
import React from "react";
import Marca from "./Marcas"; // Importamos el componente Marca

function Supreme() {
  return (
    <div>
      <Marca marca="supreme" /> {/* Pasamos "supreme" como prop */}
    </div>
  );
}

export default Supreme;
