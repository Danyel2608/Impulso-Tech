// Hombre.js
import React from "react";
import Categoria from "./Categoria"; // Importamos el componente Marca
import { useTranslation } from "../../../TranslationContext";
function Hombre() {
  const { translate } = useTranslation(); // Usamos el hook para obtener la función translate
  return (
    <div>
      <Categoria categoria={translate("men")} />
    </div>
  );
}

export default Hombre;
