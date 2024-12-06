import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./MainRoutes"; // Importa el componente de rutas
import LoadingIndicator from "./Views/UI/Spinners/LoadingIndicator";
import { TranslationProvider } from "./TranslationContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carga inicial, pero también puede usarse para obtener datos reales o cargar algo del servidor
    const loadData = async () => {
      try {
        setIsLoading(false); // Cambia a false cuando todo esté cargado
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <TranslationProvider>
      <div className="App">
        {isLoading ? (
          <LoadingIndicator /> // Muestra la animación de carga mientras isLoading es true
        ) : (
          <BrowserRouter>
            <MainRoutes /> {/* Usa las rutas dentro del router */}
          </BrowserRouter>
        )}
      </div>
    </TranslationProvider>
  );
}

export default App;
