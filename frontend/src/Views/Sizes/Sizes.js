import React from "react";
import "./Sizes.css";

function Sizes() {
  const kidSizes = [
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
  ];
  const womenSizes = ["36", "37", "38", "39", "40"];
  const menSizes = ["41", "42", "43", "44", "45"];

  // Simulando las tallas para sudaderas, pantalones, camisetas y accesorios
  const clothingSizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="sizes-container">
      <div className="section-title">
        <h2>Guía de Tallaje</h2>
      </div>

      {/* Tallas para Ropa */}
      <div className="sizes-section">
        <div className="title">
          <h3>Tallas de Ropa</h3>
        </div>
        <p>
          <strong>(Sudaderas, Pantalones, Camisetas)</strong>
        </p>
        <p>
          Las tallas de sudaderas, pantalones y camisetas generalmente siguen
          las siguientes indicaciones:
        </p>
        <ul className="sizes-list">
          {clothingSizes.map((size) => (
            <li key={size}>{size}</li>
          ))}
        </ul>
      </div>

      {/* Tallas para Accesorios */}
      <div className="sizes-section">
        <div className="title">
          <h3>Tallas para Accesorios</h3>
        </div>
        <p>
          Los accesorios como gorros, bufandas y guantes tienen un ajuste
          estándar, pero asegúrate de revisar las recomendaciones de cada
          producto específico.
        </p>
        <ul className="sizes-list">
          {clothingSizes.map((size) => (
            <li key={size}>{size}</li>
          ))}
        </ul>
      </div>

      {/* Tallas para Calzado */}
      <div className="sizes-section">
        <div className="title">
          <h3>Tallas para Calzado</h3>
        </div>
        <div className="shoe-sizes">
          <div className="sizes-column">
            <div className="sub-title">
              <h4>Calzado Niño</h4>
            </div>
            <ul className="sizes-list-kids">
              {kidSizes.map((size) => (
                <li key={size}>{size}</li>
              ))}
            </ul>
          </div>
          <div className="sizes-column">
            <div className="sub-title">
              <h4>Calzado Mujer</h4>
            </div>
            <ul className="sizes-list-women">
              {womenSizes.map((size) => (
                <li key={size}>{size}</li>
              ))}
            </ul>
          </div>
          <div className="sizes-column">
            <div className="sub-title">
              <h4>Calzado Hombre</h4>
            </div>
            <ul className="sizes-list-men">
              {menSizes.map((size) => (
                <li key={size}>{size}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sizes;
