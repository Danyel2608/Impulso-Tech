// Vans.js
import React from "react";
import Marca from "./Marcas"; // Importamos el componente Marca

function Vans() {
  return (
    <div>
      <Marca marca="vans" /> {/* Pasamos "vans" como prop */}
    </div>
  );
}

export default Vans;
