import React, { useState, useEffect, useCallback } from "react";
import Search from "../../Products/Search";
import "./Marcas.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext";
import useShoppingCart from "../../Products/hooks/useShoppingCart";
import ModalShop from "../../Products/ModalShop";
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

function Marca({ marca }) {
  const { translate } = useTranslation();
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const productosPorPagina = useResponsiveProductos();
  const [productosMarca, setProductosMarca] = useState([]);
  const [productosPagina, setProductosPagina] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const idioma = localStorage.getItem("language") || "es";

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  // Utilizamos useCallback para memorizar la función fetchProducts
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/all-products");
      const data = await response.json();

      if (response.ok) {
        const productosFiltrados = data.products.filter((producto) => {
          return (
            producto.marca?.trim().toLowerCase() === marca.trim().toLowerCase()
          );
        });

        setProductosMarca(productosFiltrados);
        setProductosFiltrados(productosFiltrados);
      } else {
        console.error("Error al obtener los productos:", data.error);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [marca]); // Dependencia para que se actualice cuando cambie 'marca'

  useEffect(() => {
    if (marca) {
      fetchProducts(); // Llamada a la función fetchProducts
    }
  }, [marca, fetchProducts]); // Dependencias actualizadas

  useEffect(() => {
    const startIdx = (paginaActual - 1) * productosPorPagina;
    const endIdx = startIdx + productosPorPagina;
    setProductosPagina(productosFiltrados.slice(startIdx, endIdx));
  }, [paginaActual, productosFiltrados, productosPorPagina]);

  const handlePageChange = (pageNumber) => {
    setPaginaActual(pageNumber);
  };

  return (
    <div className="marcas-content">
      <Header></Header>
      <div className="marcas-header">
        <h2>{marca ? marca.toUpperCase() : translate("invalid_brand")}</h2>
      </div>
      <div className="marcas-search">
        <Search
          productos={productosMarca}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list marcas-list-products">
        {productosPagina.length === 0 ? (
          <p>{translate("brand_not_aviable")}</p>
        ) : (
          productosPagina.map((producto) => (
            <div key={producto._id} className="product-card">
              <img
                src={producto.imagen_url}
                alt={producto.nombre[idioma]}
                className="product-image marca-image"
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
                {translate("price_label")}: ${producto.precio}
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

export default Marca;
