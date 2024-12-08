import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Marcas.css";
import Header from "../../Header/Header";
import { useTranslation } from "../../../TranslationContext";
import useShoppingCart from "../../Products/hooks/useShoppingCart";
import ModalShop from "../../Products/ModalShop";

function Marca({ marca }) {
  const { translate } = useTranslation();
  const {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  } = useShoppingCart();
  const [productosMarca, setProductosMarca] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const idioma = localStorage.getItem("language");

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: size, // Actualiza solo la talla del producto actual
    }));
  };
  // Esta función se ejecuta cuando la marca cambia (cuando la prop 'marca' cambia)
  useEffect(() => {
    console.log("Marca recibida:", marca); // Asegúrate de que este log sea visible y tenga el valor correcto
    if (marca) {
      fetchProducts();
    } else {
      console.error("Marca no recibida correctamente.");
    }
  }, [marca]); // Ejecutamos cuando el valor de 'marca' cambie

  // Función para obtener todos los productos de la API y filtrarlos por la marca
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        // Verifica los datos obtenidos
        console.log("Datos obtenidos de la API:", data);

        const productosFiltrados = data.products.filter((producto) => {
          if (producto.marca) {
            console.log("Producto marca:", producto.marca); // Imprime el valor de la propiedad 'marca' de cada producto
            console.log("Marca prop:", marca); // Imprime el valor del prop 'marca' que has pasado

            // Comparación para verificar que las marcas coinciden
            return (
              producto.marca.trim().toLowerCase() === marca.trim().toLowerCase()
            );
          }
          return false; // Si no tiene la propiedad 'marca', lo ignoramos
        });

        setProductosMarca(productosFiltrados);
        setProductosFiltrados(productosFiltrados);
      } else {
        console.error("Error al obtener los productos:", data.error);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  return (
    <div className="marcas-content">
      <Header></Header>
      <div className="marcas-header">
        <h2>{marca ? marca.toUpperCase() : "Marca no válida"}</h2>
      </div>
      <div className="marcas-search">
        <Search
          productos={productosMarca}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list">
        {productosFiltrados.length === 0 ? (
          <p>{translate("marca_not_aviable")}</p>
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

export default Marca;
