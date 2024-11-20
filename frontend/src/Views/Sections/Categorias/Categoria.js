import React, { useState, useEffect } from "react";
import Search from "../../Products/Search";
import "./Categoria.css";
import Header from "../../Header/Header";

function Categoria({ categoria }) {
  const [productosCategoria, setProductosCategoria] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Esta función se ejecuta cuando la marca cambia (cuando la prop 'marca' cambia)
  useEffect(() => {
    console.log("Categoria recibida:", categoria); // Asegúrate de que este log sea visible y tenga el valor correcto
    if (categoria) {
      fetchProductsCategoria();
    } else {
      console.error("Categoria no recibida correctamente.");
    }
  }, [categoria]); // Ejecutamos cuando el valor de 'marca' cambie

  // Función para obtener todos los productos de la API y filtrarlos por la marca
  const fetchProductsCategoria = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        // Verifica los datos obtenidos
        console.log("Datos obtenidos de la API:", data);

        const productosFiltrados = data.products.filter((producto) => {
          if (producto.categoria) {
            console.log("Producto categoria:", producto.categoria); // Imprime el valor de la propiedad 'marca' de cada producto
            console.log("Categoria prop:", categoria); // Imprime el valor del prop 'marca' que has pasado

            // Comparación para verificar que las marcas coinciden
            return (
              producto.categoria.trim().toLowerCase() === categoria.trim().toLowerCase()
            );
          }
          return false; // Si no tiene la propiedad 'marca', lo ignoramos
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
        <h2>{categoria ? categoria.toUpperCase() : "Categoria no válida"}</h2>
      </div>
      <div className="categoria-search">
        <Search
          productos={productosCategoria}
          setProductosFiltrados={setProductosFiltrados}
        />
      </div>

      <div className="product-list">
        {productosFiltrados.length === 0 ? (
          <p>No hay productos de {categoria} disponibles.</p>
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

export default Categoria;
