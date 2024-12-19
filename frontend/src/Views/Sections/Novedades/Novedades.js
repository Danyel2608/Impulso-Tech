import React, { useState, useEffect, useCallback } from "react";
import Search from "../../Products/Search";
import "./Novedades.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext";
import ModalShop from "../../Products/ModalShop";
import useShoppingCart from "../../Products/hooks/useShoppingCart";
import Footer from "../../Footer/Footer";

function useResponsiveProductos() {
  const [productosPorPagina, setProductosPorPagina] = useState(10);

  useEffect(() => {
    const updateProductosPorPagina = () => {
      if (window.innerWidth >= 1024) {
        setProductosPorPagina(20);
      } else if (window.innerWidth >= 768) {
        setProductosPorPagina(15);
      } else {
        setProductosPorPagina(10);
      }
    };

    updateProductosPorPagina();
    window.addEventListener("resize", updateProductosPorPagina);
    return () => {
      window.removeEventListener("resize", updateProductosPorPagina);
    };
  }, []);

  return productosPorPagina;
}

function Novedades() {
  const { translate } = useTranslation();
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const productosPorPagina = useResponsiveProductos();
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productosPagina, setProductosPagina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const idioma = localStorage.getItem("language") || "es";

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  // Memorizamos la función fetchProductsNovedades para evitar la advertencia
  const fetchProductsNovedades = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/all-products");
      const data = await response.json();

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
  }, [translate]); // Dependencia traducida, ya que el texto de error depende de la traducción

  // useEffect para llamar a fetchProductsNovedades
  useEffect(() => {
    fetchProductsNovedades();
  }, [fetchProductsNovedades]); // Dependencia fetchProductsNovedades incluida

  useEffect(() => {
    const startIdx = (paginaActual - 1) * productosPorPagina;
    const endIdx = startIdx + productosPorPagina;
    setProductosPagina(productosFiltrados.slice(startIdx, endIdx));
  }, [paginaActual, productosFiltrados, productosPorPagina]);

  const handlePageChange = (pageNumber) => {
    setPaginaActual(pageNumber);
  };

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

      <div className="product-list marcas-list-products">
        {loading ? (
          <p>{translate("loading")}</p>
        ) : error ? (
          <p>{error}</p>
        ) : productosPagina.length === 0 ? (
          <p>{translate("no_new_products")}</p>
        ) : (
          productosPagina.map((producto) => (
            <div key={producto._id} className="product-card">
              {producto.imagen_url ? (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre[idioma]}
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
              <h4 className="product-title">{producto.nombre[idioma]}</h4>
              <p className="product-price">
                {translate("price_label")}: $
                {producto.precio?.toFixed(2) || "Sin precio"}
              </p>
              <div className="product-details">
                <select
                  name="sizes"
                  id={`products-sizes-${producto._id}`}
                  value={selectedSizes[producto._id] || ""}
                  onChange={(e) =>
                    handleSizeChange(producto._id, e.target.value)
                  }
                >
                  <option value="" disabled>
                    {translate("size_label")}
                  </option>
                  {producto.talla.map((tallas, index) => (
                    <option key={index} value={tallas}>
                      {tallas}
                    </option>
                  ))}
                </select>
                <p>
                  {translate("material_label")}: {producto.material[idioma]}
                </p>
              </div>
              <div className="product-buy">
                <button
                  onClick={() => {
                    if (!selectedSizes[producto._id]) {
                      setModalMessage(translate("size_neccesary"));
                      setIsModalVisible(true);
                    } else {
                      const productoSelect = {
                        _id: producto._id,
                        nombre: producto.nombre[idioma],
                        imagen_url: producto.imagen_url,
                        precio: producto.precio,
                      };

                      agregarAlCarrito(
                        productoSelect,
                        selectedSizes[producto._id]
                      );
                    }
                  }}
                >
                  {translate("buy_button")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="pagination-container">
        {Array.from({
          length: Math.ceil(productosFiltrados.length / productosPorPagina),
        }).map((_, index) => (
          <button
            key={index}
            className={`pagination-button ${
              index + 1 === paginaActual ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            ●
          </button>
        ))}
      </div>

      <ModalShop
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        message={modalMessage}
      />
      <Footer></Footer>
    </div>
  );
}

export default Novedades;
