import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Accesorios.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext"; // Importa el hook de traducción
import useShoppingCart from "../../Products/hooks/useShoppingCart";
import ModalShop from "../../Products/ModalShop";

function Accesorios() {
  const { translate } = useTranslation(); // Usamos el hook para obtener la función translate y el idioma actual
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const idioma = localStorage.getItem("language");

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size, // Actualiza solo la talla del producto actual
    }));
  };

  const fetchProductsAccesorios = async () => {
    setLoading(true); // Establecer carga en true cuando comience la solicitud
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        // Filtrar productos que sean de tipo accesorio en el idioma actual
        const productosFiltrados = data.products.filter((producto) =>
          producto.tipo_prenda[idioma].trim().toLowerCase()
        );

        setProductosFiltrados(productosFiltrados);
      } else {
        setError(data.error || "Error desconocido"); // Manejar el error de la API
      }
    } catch (error) {
      setError("Error al obtener productos: " + error.message); // Capturar errores de red
    } finally {
      setLoading(false); // Desactivar el estado de carga una vez terminada la solicitud
    }
  };

  useEffect(() => {
    fetchProductsAccesorios();
  }, []);

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

      <div className="product-list">
        {loading ? (
          <p>{translate("loading_products")}</p>
        ) : error ? (
          <p>{error}</p>
        ) : productosFiltrados.length === 0 ? (
          <p>{translate("no_accessories_found")}</p>
        ) : (
          productosFiltrados.map((producto, index) => {
            const idioma = localStorage.getItem("language"); // Obtener el idioma actual

            return (
              <div key={index} className="product-card">
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
                </div>
              </div>
            );
          })
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

export default Accesorios;
