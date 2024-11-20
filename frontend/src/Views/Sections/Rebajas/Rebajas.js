import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Rebajas.css";
import Header from "../../Header/Header";

function Rebajas() {
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para obtener todos los productos de la API y filtrarlos por la categoría "accesorio"
  const fetchProductsAccesorios = async () => {
    setLoading(true); // Establecer carga en true cuando comience la solicitud
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        // Filtrar los productos que sean de tipo accesorio
        const productosFiltrados = data.products.filter(
          (producto) => producto.rebaja === true
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
    <div className="rebajas-content">
      <Header />
      <div className="rebajas-header">
        <h2>REBAJAS</h2>
      </div>
      <div className="rebajas-search">
        <Search
          productos={productosFiltrados}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list">
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p>{error}</p>
        ) : productosFiltrados.length === 0 ? (
          <p>No hay productos de accesorios disponibles.</p>
        ) : (
          productosFiltrados.map((producto, index) => (
            <div key={index} className="product-card">
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="product-image"
              />
              <div className="product-description">
                {producto.rebaja && (
                  <span className="sale-tag">
                    En rebaja ({producto.descuento}% OFF)
                  </span>
                )}
                {producto.novedad && <span className="new-tag">Novedad</span>}
              </div>
              <h4 className="product-title">{producto.nombre}</h4>
              <p className="product-price">Precio: ${producto.precio}</p>
              <div className="product-details">
                <p>Talla: {producto.talla.join(", ")}</p>
                <p>Material: {producto.material}</p>
              </div>
              <div className="product-buy">
                <button type="submit">Comprar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rebajas;
