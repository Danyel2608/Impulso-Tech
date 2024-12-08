// TranslationContext.js
import React, { createContext, useState, useContext } from "react";

// Archivos de traducción
import en from "./utils/locales/en/translation.json";
import es from "./utils/locales/es/translation.json";

const translations = { en, es };

// Contexto para la traducción
const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "es"
  );

  const translate = (key) => {
    if (!translations[language][key]) {
      console.warn(
        `Missing translation for key: "${key}" in language: "${language}"`
      );
    }
    return translations[language][key] || key;
  };

  const changeLanguage = (language) => {
    // Guardar el idioma seleccionado en localStorage
    localStorage.setItem("language", language);

    // Establecer el idioma en el estado de la aplicación
    setLanguage(language);
  };

  return (
    <TranslationContext.Provider value={{ translate, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
