import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Rebajas.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext"; // Importamos el contexto de traducción
import useShoppingCart from "../../Products/hooks/useShoppingCart";
import ModalShop from "../../Products/ModalShop";

function Rebajas() {
  const { translate } = useTranslation(); // Usamos translate en lugar de textos estáticos
  const { agregarAlCarrito, isModalVisible, modalMessage, setIsModalVisible } =
  useShoppingCart();

  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const idioma = localStorage.getItem("language");

  // Función para obtener todos los productos de la API y filtrarlos por la categoría "rebaja"
  const fetchProductsRebajas = async () => {
    setLoading(true); // Establecer carga en true cuando comience la solicitud
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        // Filtrar los productos que sean de tipo "rebaja"
        const productosFiltrados = data.products.filter(
          (producto) => producto.rebaja === true
        );

        setProductosFiltrados(productosFiltrados);
      } else {
        setError(translate("error_fetching_products")); // Usamos translate aquí
      }
    } catch (error) {
      setError(translate("error_fetching_products") + ": " + error.message); // Capturar errores de red con traducción
    } finally {
      setLoading(false); // Desactivar el estado de carga una vez terminada la solicitud
    }
  };

  useEffect(() => {
    fetchProductsRebajas();
  }, []);

  return (
    <div className="rebajas-content">
      <Header />
      <div className="rebajas-header">
        <h2>{translate("sales_title")}</h2> {/* Usamos traducción aquí */}
      </div>
      <div className="rebajas-search">
        <Search
          productos={productosFiltrados}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list">
        {loading ? (
          <p>{translate("loading_products")}</p>
        ) : error ? (
          <p>{error}</p>
        ) : productosFiltrados.length === 0 ? (
          <p>{translate("no_sales_products")}</p>
        ) : (
          productosFiltrados.map((producto, index) => (
            <div key={index} className="product-card">
              <img
                src={producto.imagen_url}
                alt={producto.nombre[idioma]}
                className="product-image"
              />
              <div className="product-description">
                {producto.rebaja && (
                  <span className="sale-tag">
                    {translate("on_sale")} ({producto.descuento}%{" "}
                    {translate("off")})
                  </span>
                )}
                {producto.novedad && (
                  <span className="new-tag">{translate("new")}</span>
                )}
              </div>
              <h4 className="product-title">{producto.nombre[idioma]}</h4>
              <p className="product-price">
                {translate("price_label")}: ${producto.precio}
              </p>
              <div className="product-details">
                <p>
                  {translate("size_label")}: {producto.talla.join(", ")}
                </p>
                <p>
                  {translate("material_label")}: {producto.material[idioma]}
                </p>
              </div>
              <div className="product-buy">
                <button onClick={() => agregarAlCarrito(producto)}>
                  {translate("buy_button")}
                </button>
              </div>
            </div>
          ))
        )}
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

export default Rebajas;
