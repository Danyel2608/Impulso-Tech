import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Categoria.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext"; // Importa el hook de traducción
import ModalShop from "../../Products/ModalShop";
import useShoppingCart from "../../Products/hooks/useShoppingCart";

function Categoria({ categoria }) {
  const { translate } = useTranslation(); // Usamos el hook para obtener la función translate
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const [productosCategoria, setProductosCategoria] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size, // Actualiza solo la talla del producto actual
    }));
  };

  // Obtener el idioma actual desde el contexto o el almacenamiento local
  const idioma = localStorage.getItem("language") || "es";

  // Esta función se ejecuta cuando la categoría cambia
  useEffect(() => {
    console.log("Categoria recibida:", categoria);
    if (categoria) {
      fetchProductsCategoria();
    } else {
      console.error("Categoria no recibida correctamente.");
    }
  }, [categoria]); // Ejecutamos cuando el valor de 'categoria' cambie

  // Función para obtener todos los productos de la API y filtrarlos por la categoría
  const fetchProductsCategoria = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        // Filtrar los productos que coincidan con la categoría en el idioma seleccionado
        const productosFiltrados = data.products.filter((producto) => {
          if (producto.categoria[idioma]) {
            return producto.categoria[idioma] === categoria;
          }
          return false; // Ignoramos los productos sin categoría en el idioma actual
        });

        setProductosCategoria(productosFiltrados);
        setProductosFiltrados(productosFiltrados);
      } else {
        console.error("Error al obtener los productos:", data.error);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
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

      <div className="product-list">
        {productosFiltrados.length === 0 ? (
          <p>{translate("no_products_in_category", { category: categoria })}</p>
        ) : (
          productosFiltrados.map((producto, index) => (
            <div key={index} className="product-card">
              <img
                src={producto.imagen_url}
                alt={producto.nombre[idioma]} // Usamos el idioma actual para el nombre
                className="product-image"
                id={producto._id}
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
                {producto.nombre[idioma]} {/* Usamos el idioma actual */}
              </h4>
              <p className="product-price">
                {producto.precio}
                {translate("price_label")}
              </p>
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
                  {translate("material_label")}: {producto.material[idioma]}{" "}
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
                      const productoSelect = {
                        _id: producto._id,
                        nombre: producto.nombre[idioma], // Usar el nombre según el idioma
                        imagen_url: producto.imagen_url, // Usar la imagen
                        precio: producto.precio, // Usar el precio
                      };

                      console.log(productoSelect); // Esto debería mostrar solo los valores que quieres

                      // Ahora pasas el producto correctamente al carrito
                      agregarAlCarrito(
                        productoSelect,
                        selectedSizes[producto._id]
                      );
                    }
                  }}
                >
                  {translate("buy_button")}
                </button>
              </div>{" "}
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

export default Categoria;
