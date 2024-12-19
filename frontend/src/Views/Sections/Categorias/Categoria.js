import React, { useState, useEffect, useCallback } from "react";
import Search from "../../Products/Search";
import "./Categoria.css";
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

function Categoria({ categoria }) {
  const { translate } = useTranslation();
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const productosPorPagina = useResponsiveProductos();
  const [productosCategoria, setProductosCategoria] = useState([]);
  const [productosPagina, setProductosPagina] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);

  const idioma = localStorage.getItem("language") || "es";

  // Usamos useCallback aquí para evitar que la función cambie en cada render
  const fetchProductsCategoria = useCallback(async () => {
    try {
      const response = await fetch("/api/all-products");
      const data = await response.json();

      if (response.ok) {
        const productosFiltrados = data.products.filter((producto) =>
          producto.categoria[idioma]
            ? producto.categoria[idioma] === categoria
            : false
        );

        setProductosCategoria(productosFiltrados);
        setProductosFiltrados(productosFiltrados);
      } else {
        console.error("Error al obtener los productos:", data.error);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [categoria, idioma]); // Aseguramos que se actualice cuando 'categoria' o 'idioma' cambien

  useEffect(() => {
    if (categoria) {
      fetchProductsCategoria();
    }
  }, [categoria, fetchProductsCategoria]); // Agregamos fetchProductsCategoria a las dependencias

  useEffect(() => {
    const startIdx = (paginaActual - 1) * productosPorPagina;
    const endIdx = startIdx + productosPorPagina;
    setProductosPagina(productosFiltrados.slice(startIdx, endIdx));
  }, [paginaActual, productosFiltrados, productosPorPagina]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setPaginaActual(pageNumber);
  };

  return (
    <div className="categoria-content">
      <Header></Header>
      <div className="categoria-header">
        <h2>
          {categoria ? categoria.toUpperCase() : translate("invalid_category")}
        </h2>
      </div>
      <div className="categoria-search">
        <Search
          productos={productosCategoria}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list marcas-list-products">
        {productosPagina.length === 0 ? (
          <p>{translate("no_products_in_category", { category: categoria })}</p>
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
                {producto.precio} {translate("price_label")}
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

export default Categoria;
