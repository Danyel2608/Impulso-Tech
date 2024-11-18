// ProductsPage.js
import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Search from "./Search"; // Importar el componente Search

function ProductsPage() {
  // Estado para almacenar los productos y el número de página
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Productos después de aplicar el filtro
  const [productosVista, setProductosVista] = useState([]); // Productos que se muestran en pantalla
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el texto de búsqueda

  // Función para hacer la solicitud GET y obtener los productos
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        setProductos(data.products); // Almacenar todos los productos
        setProductosFiltrados(data.products); // Inicialmente no hay filtro, por lo que mostramos todos los productos
        setProductosVista(data.products.slice(0, 10)); // Mostrar los primeros 10 productos
      } else {
        console.error("Error al obtener los productos:", data.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para ejecutar fetchProducts al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función para filtrar productos
  const filterProducts = (query) => {
    if (!query) return productos; // Si no hay texto de búsqueda, mostramos todos los productos

    // Dividir la consulta en palabras clave
    const queryWords = query
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "");

    return productos.filter((producto) => {
      const nombre = producto.nombre.toLowerCase();
      const talla = producto.talla.join(" ").toLowerCase();
      const color = producto.color.join(" ").toLowerCase();
      const material = producto.material.toLowerCase();

      // Verificar si todas las palabras de la búsqueda coinciden en algún campo del producto
      return queryWords.every(
        (word) =>
          nombre.includes(word) ||
          talla.includes(word) ||
          color.includes(word) ||
          material.includes(word)
      );
    });
  };

  // Función para manejar la búsqueda en el input
  const handleSearch = () => {
    const filteredProducts = filterProducts(searchQuery);
    setProductosFiltrados(filteredProducts); // Actualizamos los productos filtrados
    setPaginaActual(1); // Resetear a la primera página
    setProductosVista(filteredProducts.slice(0, 10)); // Mostrar los primeros 10 productos filtrados
  };

  // Función para cargar más productos filtrados
  const loadMoreProducts = () => {
    const siguientePagina = paginaActual + 1;
    setPaginaActual(siguientePagina);
    const nuevosProductos = productosFiltrados.slice(0, siguientePagina * 10); // Cargar los productos correspondientes a la página filtrada
    setProductosVista(nuevosProductos);
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Actualizar el estado del texto de búsqueda
  };

  // Manejar el evento de presionar "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Ejecutar búsqueda al presionar "Enter"
    }
  };

  // Verificar si hay más productos para cargar
  const hasMoreProducts = productosVista.length < productosFiltrados.length;

  return (
    <div className="product-page-main">
      <Header />
      <div className="products-page-content">
        <h3>Ropa que te representa: ¡Encuentra tu estilo!</h3>
        {/* Usamos el componente Search */}
        <Search
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
        />
        <div className="product-list">
          {productosVista.length === 0 ? (
            <h5>No se encontraron resultados para tu búsqueda.</h5>
          ) : (
            productosVista.map((producto, index) => (
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
                <p className="product-price">${producto.precio.toFixed(2)}</p>
                <div className="product-details">
                  <p>
                    Talla: {producto.talla.join(", ")} <br />
                  </p>
                  <p>
                    Color: {producto.color.join(", ")} <br />
                  </p>
                  <p>Material: {producto.material}</p>
                </div>
                <div className="product-buy">
                  <button type="submit">Comprar</button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Mostrar el botón "Cargar más" solo si hay más productos para mostrar */}
        {hasMoreProducts && (
          <div className="load-more-button">
            {isLoading ? (
              <button disabled>Loading...</button>
            ) : (
              <button onClick={loadMoreProducts}>Cargar más</button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductsPage;
