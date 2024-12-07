import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Search from "./Search";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import ModalShop from "./ModalShop";
import { useTranslation } from "../../TranslationContext";
import useShoppingCart from "./hooks/useShoppingCart"; // Importa el hook

function ProductsPage() {
  const { translate } = useTranslation();

  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productosVista, setProductosVista] = useState([]);
  const [cantidadCargada, setCantidadCargada] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const idioma = localStorage.getItem("language");

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size, // Actualiza solo la talla del producto actual
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8001/api/all-products");
        if (!response.ok) {
          throw new Error(translate("error_fetching_products"));
        }
        const data = await response.json();
        const language = localStorage.getItem("language");
        const translatedProducts = data.products.map((product) => ({
          ...product,
          nombre: product.nombre[language],
          descripcion: product.descripcion[language],
          categoria: product.categoria[language],
          tipo_prenda: product.tipo_prenda[language],
          talla: product.talla,
          color: product.color[language],
          material: product.material[language],
        }));
        setProductos(translatedProducts);
        setProductosFiltrados(translatedProducts);
      } catch (error) {
        console.error(translate("error_fetching_products"), error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [translate]);

  useEffect(() => {
    const productosAMostrar = productosFiltrados.slice(0, cantidadCargada);
    setProductosVista(productosAMostrar);
  }, [productosFiltrados, cantidadCargada]);

  return (
    <div className="product-page-main">
      <Header />
      <div className="products-page-content">
        <h3>{translate("find_your_style")}</h3>
        <Search
          productos={productos}
          setProductosFiltrados={setProductosFiltrados}
        />
        <div className="product-list">
          {isLoading ? (
            <p>{translate("loading_products")}</p>
          ) : productosVista.length === 0 ? (
            <h5>{translate("no_results_found")}</h5>
          ) : (
            productosVista.map((producto) => (
              <div className="product-card" key={producto._id}>
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
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
                <h4 className="product-title">
                  {producto.nombre} {/* Usamos el idioma actual */}
                </h4>{" "}
                <p className="product-price">
                  {translate("price_label")}: {producto.precio}
                </p>{" "}
                <div className="product-details">
                  <select
                    name="sizes"
                    id={`products-sizes-${producto._id}`}
                    value={selectedSizes[producto._id] || ""} // Valor específico por producto
                    onChange={(e) =>
                      handleSizeChange(producto._id, e.target.value)
                    } // Actualiza la talla del producto actual
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
                    {translate("material_label")}: {producto.material}{" "}
                    {/* Usamos el idioma actual */}
                  </p>
                </div>
                <div className="product-buy">
                  <button
                    onClick={() => {
                      if (!selectedSizes[producto._id]) {
                        // Mostrar modal si no se selecciona talla
                        setModalMessage(translate("size_neccesary"));
                        setIsModalVisible(true); // Mostrar modal
                      } else {
                        // Agregar producto al carrito con la talla seleccionada
                        agregarAlCarrito(producto, selectedSizes[producto._id]);
                        console.log(producto.imagen_url);
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
      </div>
      <Footer />
      <ShoppingCart />
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

export default ProductsPage;
