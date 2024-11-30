// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Asegúrate de que las rutas estén correctas
import es from "../locales/es.json"; // O ajusta la ruta si está en otro lugar
import en from "../locales/en.json";

i18n
  .use(initReactI18next) // Pasa la instancia de i18next a React
  .init({
    resources: {
      es: {
        translation: es,
      },
      en: {
        translation: en,
      },
    },
    lng: "es", // Idioma por defecto
    fallbackLng: "es", // Idioma alternativo si no se encuentra el texto traducido
    interpolation: {
      escapeValue: false, // React ya maneja la seguridad en XSS
    },
  });

export default i18n;
