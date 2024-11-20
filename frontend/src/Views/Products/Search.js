import React, { useState, useEffect, useRef } from "react";
import "./Search.css";

function Search({ productos, setProductosFiltrados }) {
  const [searchQuery, setSearchQuery] = useState(""); // Para la búsqueda
  const [activeFilters, setActiveFilters] = useState({
    alphabetical: false,
    alphabetical2: false,
    priceLowToHigh: false,
    priceHighToLow: false,
    discount: false,
    discount2: false,
    stock: false,
  }); // Estado para saber qué filtros están activos

  const allProductsRef = useRef([]); // Ref para almacenar los productos originales

  useEffect(() => {
    if (allProductsRef.current.length === 0) {
      allProductsRef.current = productos; // Guardamos los productos iniciales solo una vez
    }
  }, [productos]); // Se ejecuta solo cuando 'productos' cambia por primera vez

  // Función para ordenar los productos utilizando el algoritmo de selección
  const selectionSort = (arr, key, ascending = true) => {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      let targetIndex = i;
      for (let j = i + 1; j < n; j++) {
        // Comparar según la clave y el orden
        if (
          (ascending && arr[j][key] < arr[targetIndex][key]) ||
          (!ascending && arr[j][key] > arr[targetIndex][key])
        ) {
          targetIndex = j;
        }
      }
      // Intercambiar si es necesario
      if (i !== targetIndex) {
        [arr[i], arr[targetIndex]] = [arr[targetIndex], arr[i]];
      }
    }
    return arr;
  };

  // Función para aplicar los filtros de orden
  const applyFilters = (filteredProducts) => {
    let products = [...filteredProducts];

    // Aplicar filtro de búsqueda
    if (searchQuery.trim()) {
      products = products.filter((producto) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          producto.nombre.toLowerCase().includes(lowerCaseQuery) ||
          producto.talla.join(" ").toLowerCase().includes(lowerCaseQuery) ||
          producto.color.join(" ").toLowerCase().includes(lowerCaseQuery) ||
          producto.material.toLowerCase().includes(lowerCaseQuery) ||
          producto.tipo_prenda.toLowerCase().includes(lowerCaseQuery) ||
          producto.categoria.toLowerCase().includes(lowerCaseQuery) ||
          producto.marca.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Si el filtro "alphabetical" está activo (A-Z)
    if (activeFilters.alphabetical) {
      products = selectionSort(products, "nombre", true);
    }

    // Si el filtro "alphabetical2" está activo (Z-A)
    if (activeFilters.alphabetical2) {
      products = selectionSort(products, "nombre", false);
    }

    // Si el filtro "priceLowToHigh" está activo
    if (activeFilters.priceLowToHigh) {
      products = selectionSort(products, "precio", true);
    }

    // Si el filtro "priceHighToLow" está activo
    if (activeFilters.priceHighToLow) {
      products = selectionSort(products, "precio", false);
    }

    // Si el filtro "discount" está activo
    if (activeFilters.discount) {
      products = selectionSort(products, "descuento", false); // Orden de mayor a menor
    }

    // Si el filtro "discount2" está activo
    if (activeFilters.discount2) {
      products = selectionSort(products, "descuento", true); // Orden de menor a mayor
    }

    // Si el filtro "stock" está activo
    if (activeFilters.stock) {
      products = selectionSort(products, "stock", false); // Orden de mayor a menor
    }

    // Finalmente, actualizamos el estado con los productos ordenados
    setProductosFiltrados(products);
  };

  // Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query); // Actualizar el estado de la búsqueda
    applyFilters(allProductsRef.current); // Aplicar los filtros con los productos actuales
  };

  // Manejo de cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  // Ejecutar la búsqueda al presionar "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  // Cambiar el estado de los filtros (activar/desactivar)
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setActiveFilters((prev) => {
      const newFilters = { ...prev, [name]: checked };
      applyFilters(allProductsRef.current); // Aplicar filtros después de cambiar uno
      return newFilters;
    });
  };

  return (
    <div className="search-and-filters">
      <div className="products-page-search">
        <input
          type="search"
          name="searchProducts"
          id="searchProducts"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleSearchChange} // Llamar a handleSearch cada vez que el usuario escribe
          onKeyDown={handleKeyDown} // Ejecutar búsqueda al presionar "Enter"
        />
        <i
          className="fa-solid fa-magnifying-glass"
          onClick={() => handleSearch(searchQuery)} // Buscar al hacer clic en el ícono
        ></i>
      </div>

      {/* Filtros de orden */}
      <div className="filters">
        <h4>Filtrar por:</h4>
        <label>
          <input
            type="checkbox"
            name="alphabetical"
            checked={activeFilters.alphabetical}
            onChange={handleFilterChange}
          />
          Nombre (A-Z)
        </label>
        <label>
          <input
            type="checkbox"
            name="alphabetical2"
            checked={activeFilters.alphabetical2}
            onChange={handleFilterChange}
          />
          Nombre (Z-A)
        </label>
        <label>
          <input
            type="checkbox"
            name="priceLowToHigh"
            checked={activeFilters.priceLowToHigh}
            onChange={handleFilterChange}
          />
          Precio: Menor a Mayor
        </label>
        <label>
          <input
            type="checkbox"
            name="priceHighToLow"
            checked={activeFilters.priceHighToLow}
            onChange={handleFilterChange}
          />
          Precio: Mayor a Menor
        </label>
        <label>
          <input
            type="checkbox"
            name="discount"
            checked={activeFilters.discount}
            onChange={handleFilterChange}
          />
          Descuento: Mayor a Menor
        </label>
        <label>
          <input
            type="checkbox"
            name="discount2"
            checked={activeFilters.discount2}
            onChange={handleFilterChange}
          />
          Descuento: Menor a Mayor
        </label>
        <label>
          <input
            type="checkbox"
            name="stock"
            checked={activeFilters.stock}
            onChange={handleFilterChange}
          />
          Stock: Mayor a Menor
        </label>
      </div>
    </div>
  );
}

export default Search;
