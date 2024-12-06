import { useTranslation } from "../../TranslationContext";
import "./HeaderLanguages.css";

function HeaderLanguages() {
  const { translate, changeLanguage } = useTranslation();

  return (
    <div className="languages">
      <p onClick={() => changeLanguage("es")}>ES</p>
      <p onClick={() => changeLanguage("en")}>EN</p>
    </div>
  );
}

export default HeaderLanguages;
