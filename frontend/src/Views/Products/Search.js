import React, { useState } from "react";
import "./Search.css";

function Search({ productos, setProductosFiltrados }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (!searchQuery) {
      setProductosFiltrados(productos); // Si no hay búsqueda, mostrar todos los productos
      return;
    }

    // Filtramos productos que coinciden con la búsqueda en nombre, talla, color o material
    const filteredProducts = productos.filter((producto) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        producto.nombre.toLowerCase().includes(lowerCaseQuery) ||
        producto.talla.join(" ").toLowerCase().includes(lowerCaseQuery) ||
        producto.color.join(" ").toLowerCase().includes(lowerCaseQuery) ||
        producto.material.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setProductosFiltrados(filteredProducts); // Actualizar los productos filtrados
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Actualizar el valor de búsqueda
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Ejecutar búsqueda al presionar "Enter"
    }
  };

  return (
    <div className="products-page-search">
      <input
        type="search"
        name="searchProducts"
        id="searchProducts"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      <i
        className="fa-solid fa-magnifying-glass"
        onClick={handleSearch} // Buscar al hacer clic en el ícono
      ></i>
    </div>
  );
}

export default Search;
