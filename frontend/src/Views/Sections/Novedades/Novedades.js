import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Novedades.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext"; // Importamos el contexto de traducción
import ModalShop from "../../Products/ModalShop";
import useShoppingCart from "../../Products/hooks/useShoppingCart";

function Novedades() {
  const { translate } = useTranslation(); // Usamos translate en lugar de texto estático
  const { agregarAlCarrito, isModalVisible, modalMessage, setIsModalVisible } =
  useShoppingCart();
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const idioma = localStorage.getItem("language");
  // Función para obtener todos los productos de la API y filtrarlos por la categoría "novedad"
  const fetchProductsNovedades = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();
      console.log(data); // Para verificar la estructura de los datos.

      if (response.ok) {
        const productosFiltrados = data.products.filter(
          (producto) => producto.novedad === true
        );
        setProductosFiltrados(productosFiltrados);
      } else {
        setError(translate("error_fetching_products"));
      }
    } catch (error) {
      setError(translate("error_fetching_products") + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsNovedades();
  }, []);

  return (
    <div className="novedades-content">
      <Header />
      <div className="novedades-header">
        <h2>{translate("new_arrivals_title")}</h2>
      </div>
      <div className="novedades-search">
        <Search
          productos={productosFiltrados}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list">
        {productosFiltrados.map((producto, index) => (
          <div key={index} className="product-card">
            {producto.imagen_url ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre[idioma]} // Usamos el idioma actual para el nombre
                className="product-image"
              />
            ) : (
              <div className="image-placeholder">
                {translate("no_image_available")}
              </div>
            )}
            <div className="product-description">
              {producto.rebaja && producto.descuento ? (
                <span className="sale-tag">
                  {translate("on_sale")} ({producto.descuento}%{" "}
                  {translate("off")})
                </span>
              ) : null}

              {producto.novedad && (
                <span className="new-tag">{translate("new")}</span>
              )}
            </div>
            <h4 className="product-title">
              {producto.nombre[idioma]} {/* Usamos el idioma actual */}
            </h4>
            <p className="product-price">
              {translate("price_label")}: $
              {producto.precio?.toFixed(2) || "Sin precio"}
            </p>
            <div className="product-details">
              <p>
                {translate("size_label")}:{" "}
                {Array.isArray(producto.talla)
                  ? producto.talla.join(", ")
                  : "Tamaño desconocido"}
              </p>
              <p>
                {translate("material_label")}: {translate("material_label")}:{" "}
                {producto.material[idioma]}{" "}
              </p>
            </div>
            <div className="product-buy">
                <button onClick={() => agregarAlCarrito(producto)}>
                  {translate("buy_button")}
                </button>
              </div>
          </div>
        ))}
      </div>
      <ModalShop
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        message={modalMessage}
      />
    </div>
  );
}

export default Novedades;
