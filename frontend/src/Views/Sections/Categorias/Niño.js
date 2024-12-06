// Niño.js
import React from "react";
import Categoria from "./Categoria"; // Importamos el componente Marca
import { useTranslation } from "../../../TranslationContext";

function Niño() {
  const { translate } = useTranslation(); // Usamos el hook para obtener la función translate

  return (
    <div>
      <Categoria categoria={translate("children")} /> {/* Pasamos "Niño" como prop */}
    </div>
  );
}

export default Niño;
