import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Search from "./Search"; // Importar el componente Search
import { useHistory } from "react-router-dom"; // Si estás usando react-router

function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productosVista, setProductosVista] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(20);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [carrito, setCarrito] = useState([]); // Estado del carrito

  // Función para hacer la solicitud GET y obtener los productos
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8001/api/all-products");
      const data = await response.json();

      if (response.ok) {
        setProductos(data.products);
        setProductosFiltrados(data.products);
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
  }, []);

  // useEffect para actualizar productosVista cada vez que cambian los productos filtrados
  useEffect(() => {
    const totalProductos = productosFiltrados.length;
    setTotalPaginas(Math.ceil(totalProductos / productosPorPagina));

    const startIndex = (paginaActual - 1) * productosPorPagina;
    const endIndex = startIndex + productosPorPagina;
    setProductosVista(productosFiltrados.slice(startIndex, endIndex));
  }, [productosFiltrados, paginaActual]);

  // Función para cambiar de página
  const handlePageChange = (pagina) => {
    setPaginaActual(pagina);
  };

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      // Verificar si el producto ya está en el carrito
      const productoExistente = prevCarrito.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {
        // Si ya existe, solo aumentar la cantidad
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregar el producto al carrito
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Función para generar las páginas visibles (con un rango limitado)
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const range = 2;
    let startPage = Math.max(paginaActual - range, 1);
    let endPage = Math.min(paginaActual + range, totalPaginas);

    if (startPage > 1) pageNumbers.push(1);
    if (paginaActual > range + 1) pageNumbers.push("...");

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPaginas) pageNumbers.push("...");
    if (endPage < totalPaginas) pageNumbers.push(totalPaginas);

    return pageNumbers;
  };

  return (
    <div className="product-page-main">
      <Header />
      <div className="products-page-content">
        <h3>Ropa que te representa: ¡Encuentra tu estilo!</h3>

        <Search
          productos={productos}
          setProductosFiltrados={setProductosFiltrados}
        />

        <div className="product-list">
          {productosVista.length === 0 ? (
            <h5>No se encontraron resultados para tu búsqueda.</h5>
          ) : (
            productosVista.map((producto) => (
              <div key={producto.id} className="product-card">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="product-image"
                />
                <h4>{producto.nombre}</h4>
                <p>${producto.precio.toFixed(2)}</p>
                <div className="product-buy">
                  <button onClick={() => agregarAlCarrito(producto)}>
                    Comprar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductsPage;
