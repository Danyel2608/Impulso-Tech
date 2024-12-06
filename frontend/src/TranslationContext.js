// TranslationContext.js
import React, { createContext, useState, useContext } from "react";

// Archivos de traducción
import en from "./utils/locales/en/translation.json";
import es from "./utils/locales/es/translation.json";

const translations = { en, es };

// Contexto para la traducción
const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Idioma por defecto

  const translate = (key) => {
    return translations[language][key] || key; // Devuelve la traducción o la clave si no existe
  };

  const changeLanguage = (lang) => {
    // Guardar el idioma seleccionado en localStorage
    localStorage.setItem("language", lang);

    // Establecer el idioma en el estado de la aplicación
    setLanguage(lang);
  };

  return (
    <TranslationContext.Provider value={{ translate, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
