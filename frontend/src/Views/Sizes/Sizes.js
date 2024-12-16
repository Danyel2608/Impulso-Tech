import React from "react";
import "./Sizes.css";
import { useTranslation } from "../../TranslationContext"; // Ajusta la ruta según sea necesario
import HeaderLanguages from "../Header/HeaderLanguages";

function Sizes() {
  const { translate } = useTranslation();

  const kidSizes = [
    { size: "20", cm: "12.5 cm" },
    { size: "21", cm: "13.0 cm" },
    { size: "22", cm: "13.5 cm" },
    { size: "23", cm: "14.0 cm" },
    { size: "24", cm: "14.5 cm" },
    { size: "25", cm: "15.0 cm" },
    // Agregar más tallas y sus correspondientes medidas
  ];
  const womenSizes = [
    { size: "36", cm: " 58 cm" },
    { size: "37", cm: "23 60 cm" },
    { size: "38", cm: " 61 cm" },
    { size: "39", cm: " 63 cm" },
    { size: "40", cm: " 66 cm" },
  ];
  const menSizes = [
    { size: "41", cm: " 68 cm" },
    { size: "42", cm: "27 70 cm" },
    { size: "43", cm: " 72 cm" },
    { size: "44", cm: "28 74 cm" },
    { size: "45", cm: " 75 cm" },
  ];
  const clothingSizes = [
    { size: "S", cm: " 81-86 cm" },
    { size: "M", cm: "  89-94 cm" },
    { size: "L", cm: "  97-102 cm" },
    { size: "XL", cm: " 104-109 cm" },
    { size: "XXL", cm: "  112-117 cm" },
  ];

  return (
    <div className="sizes-container">
      <a href="/">
        <i className="fa-solid fa-house"></i>
      </a>
      <HeaderLanguages />
      <div className="section-title">
        <h2>{translate("sizeGuideTitle")}</h2>
      </div>

      {/* Tallas para Ropa */}
      <div className="sizes-section">
        <div className="title">
          <h3>{translate("clothingTitle")}</h3>
        </div>
        <p>
          <strong>{translate("clothingSubtitle")}</strong>
        </p>
        <p>{translate("clothingDescription")}</p>
        <table className="sizes-table">
          <thead>
            <tr>
              <th>{translate("size")}</th>
              <th>{translate("cmEquivalent")}</th>
            </tr>
          </thead>
          <tbody>
            {clothingSizes.map((size, index) => (
              <tr key={index}>
                <td>{size.size}</td>
                <td>{size.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tallas para Calzado */}
      <div className="sizes-section">
        <div className="title">
          <h3>{translate("shoesTitle")}</h3>
        </div>
        <div className="shoe-sizes">
          <div className="sizes-column">
            <div className="sub-title">
              <h4>{translate("kidsShoesTitle")}</h4>
            </div>
            <table className="sizes-table">
              <thead>
                <tr>
                  <th>{translate("size")}</th>
                  <th>{translate("cmEquivalent")}</th>
                </tr>
              </thead>
              <tbody>
                {kidSizes.map((size, index) => (
                  <tr key={index}>
                    <td>{size.size}</td>
                    <td>{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sizes-column">
            <div className="sub-title">
              <h4>{translate("womenShoesTitle")}</h4>
            </div>
            <table className="sizes-table">
              <thead>
                <tr>
                  <th>{translate("size")}</th>
                  <th>{translate("cmEquivalent")}</th>
                </tr>
              </thead>
              <tbody>
                {womenSizes.map((size, index) => (
                  <tr key={index}>
                    <td>{size.size}</td>
                    <td>{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sizes-column">
            <div className="sub-title">
              <h4>{translate("menShoesTitle")}</h4>
            </div>
            <table className="sizes-table">
              <thead>
                <tr>
                  <th>{translate("size")}</th>
                  <th>{translate("cmEquivalent")}</th>
                </tr>
              </thead>
              <tbody>
                {menSizes.map((size, index) => (
                  <tr key={index}>
                    <td>{size.size}</td>
                    <td>{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sizes;
