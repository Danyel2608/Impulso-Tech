import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Accesorios.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext"; // Importa el hook de traducción
import useShoppingCart from "../../Products/hooks/useShoppingCart";
import ModalShop from "../../Products/ModalShop";

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

function Accesorios() {
  const { translate } = useTranslation();
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const productosPorPagina = useResponsiveProductos();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productosPagina, setProductosPagina] = useState([]); // Productos visibles por página
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const idioma = localStorage.getItem("language");

  useEffect(() => {
    const fetchProductsAccesorios = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/all-products");
        const data = await response.json();

        if (response.ok) {
          const accesorios = data.products.filter(
            (producto) =>
              producto.tipo_prenda[idioma].trim().toLowerCase() === "accesorio"
          );
          setProductosFiltrados(accesorios);
        } else {
          setError(data.error || "Error desconocido");
        }
      } catch (error) {
        setError("Error al obtener productos: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAccesorios();
  }, [idioma]);

  useEffect(() => {
    const startIdx = (paginaActual - 1) * productosPorPagina;
    const endIdx = startIdx + productosPorPagina;
    setProductosPagina(productosFiltrados.slice(startIdx, endIdx));
  }, [paginaActual, productosFiltrados, productosPorPagina]);

  const handlePageChange = (pageNumber) => {
    setPaginaActual(pageNumber);
  };

  return (
    <div className="accesorios-content">
      <Header />
      <div className="accesorios-header">
        <h2>{translate("accesorios_title")}</h2>
      </div>
      <div className="accesorios-search">
        <Search
          productos={productosFiltrados}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list marcas-list-products">
        {loading ? (
          <p>{translate("loading_products")}</p>
        ) : error ? (
          <p>{error}</p>
        ) : productosPagina.length === 0 ? (
          <p>{translate("no_accessories_found")}</p>
        ) : (
          productosPagina.map((producto) => (
            <div key={producto._id} className="product-card">
              <img
                src={producto.imagen_url}
                alt={producto.nombre[idioma]}
                className="product-image"
              />
              <div className="product-description">
                {producto.rebaja && (
                  <span className="sale-tag">
                    {translate("on_sale")} ({producto.descuento}% OFF)
                  </span>
                )}
                {producto.novedad && (
                  <span className="new-tag">{translate("new_arrival")}</span>
                )}
              </div>
              <h4 className="product-title">{producto.nombre[idioma]}</h4>
              <p className="product-price">
                {translate("price_label")}: {producto.precio}
              </p>
              <div className="product-details">
                <select
                  name="sizes"
                  id={`products-sizes-${producto._id}`}
                  value={selectedSizes[producto._id] || ""}
                  onChange={(e) =>
                    setSelectedSizes({
                      ...selectedSizes,
                      [producto._id]: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    {translate("size_label")}
                  </option>
                  {producto.talla.map((talla, index) => (
                    <option key={index} value={talla}>
                      {talla}
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
                      agregarAlCarrito(producto, selectedSizes[producto._id]);
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
    </div>
  );
}

export default Accesorios;
