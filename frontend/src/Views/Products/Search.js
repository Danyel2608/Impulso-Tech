import React, { useState, useEffect, useRef } from "react";
import "./Search.css";

function Search({ productos, setProductosFiltrados }) {
  const [searchQuery, setSearchQuery] = useState(""); // Para la búsqueda
  const [selectedFilter, setSelectedFilter] = useState(""); // Para el filtro seleccionado

  const allProductsRef = useRef([]); // Ref para almacenar los productos originales

  // Guardamos los productos originales una sola vez en el ref
  useEffect(() => {
    if (allProductsRef.current.length === 0) {
      allProductsRef.current = productos; // Guardamos los productos iniciales solo una vez
    }
  }, [productos]);

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
  const applyFilters = () => {
    let products = [...allProductsRef.current];

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

    // Si el filtro es de descuento, solo tomar los productos con descuento
    if (selectedFilter === "discount" || selectedFilter === "discount2") {
      // Filtrar productos con descuento
      products = products.filter(
        (producto) => producto.rebaja && producto.descuento > 0
      );
    }

    // Ordenar productos con descuento o sin descuento según el filtro seleccionado
    switch (selectedFilter) {
      case "discount":
        // Ordenar de mayor descuento a menor
        products.sort((a, b) => b.descuento - a.descuento);
        break;
      case "discount2":
        // Ordenar de menor descuento a mayor
        products.sort((a, b) => a.descuento - b.descuento);
        break;
      case "alphabetical":
        products.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "alphabetical2":
        products.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "priceLowToHigh":
        products.sort((a, b) => a.precio - b.precio);
        break;
      case "priceHighToLow":
        products.sort((a, b) => b.precio - a.precio);
        break;
      case "stock":
        products.sort((a, b) => b.stock - a.stock);
        break;
      case "stock2":
        products.sort((a, b) => a.stock - b.stock);
        break;
      default:
        break;
    }

    // Finalmente, actualizamos el estado con los productos ordenados
    setProductosFiltrados(products);
  };

  // Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query); // Actualizar el estado de la búsqueda
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

  // Función para manejar el cambio de filtro
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value); // Establecer el filtro seleccionado
  };

  // useEffect que detecta cambios en searchQuery y selectedFilter
  useEffect(() => {
    applyFilters(); // Aplicamos los filtros siempre que searchQuery o selectedFilter cambien
  }, [searchQuery, selectedFilter]);

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

      {/* Filtros de orden utilizando un select */}
      <div className="filters">
        <h4>Filtrar por:</h4>
        <select onChange={handleFilterChange} value={selectedFilter}>
          <option value="">Seleccione un filtro</option>
          <option value="alphabetical">Nombre (A-Z)</option>
          <option value="alphabetical2">Nombre (Z-A)</option>
          <option value="priceLowToHigh">Precio: Menor a Mayor</option>
          <option value="priceHighToLow">Precio: Mayor a Menor</option>
          <option value="discount">Descuento: Mayor a Menor</option>
          <option value="discount2">Descuento: Menor a Mayor</option>
          <option value="stock">Stock: Mayor a Menor</option>
          <option value="stock2">Stock: Menor a Mayor</option>
        </select>
      </div>
    </div>
  );
}

export default Search;
