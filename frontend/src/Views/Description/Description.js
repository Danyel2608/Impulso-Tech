import "./Description.css";
import Description1 from "../../assets/Description1.jpg";
import Description2 from "../../assets/Cambio3.jpg";
import Description3 from "../../assets/Description3.jpg";
import Description4 from "../../assets/Cambio4.jpg";
import Description5 from "../../assets/Cambio5.jpg";
import Description6 from "../../assets/Cambio6.jpg";
import { useTranslation } from "../../TranslationContext"; // Importa el contexto de traducción

function Description() {
  const { translate } = useTranslation(); // Desestructuramos la función translate

  return (
    <div className="description-content">
      <h2>{translate("how_it_started")}</h2>{" "}
      {/* Traducción de "¿Cómo surgió Moda Urbana?" */}
      <p>{translate("description_paragraph")}</p>{" "}
      {/* Traducción del párrafo de descripción */}
      <div className="description-imgs">
        <img src={Description1} alt="Description1" />
        <img src={Description2} alt="Description2" />
        <img src={Description3} alt="Description3" />
        <img src={Description4} alt="Description4" />
        <img src={Description5} alt="Description5" />
        <img src={Description6} alt="Description6" />
      </div>
    </div>
  );
}

export default Description;
