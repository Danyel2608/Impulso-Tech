// Mujer.js
import React from "react";
import Categoria from "./Categoria"; // Importamos el componente Marca
import { useTranslation } from "../../../TranslationContext";
function Mujer() {
  const { translate } = useTranslation(); // Usamos el hook para obtener la función translate

  return (
    <div>
      <Categoria categoria={translate("women")} /> {/* Pasamos "Mujer" como prop */}
    </div>
  );
}

export default Mujer;
