import React, { useState, useEffect, useRef } from "react";
import "./Search.css";
import { useTranslation } from "../../TranslationContext"; // Importa el contexto de traducción

function Search({ productos, setProductosFiltrados }) {
  const { translate } = useTranslation(); // Agregar idioma activo desde el contexto
  const [searchQuery, setSearchQuery] = useState(""); // Para la búsqueda
  const [selectedFilter, setSelectedFilter] = useState(""); // Para el filtro seleccionado

  const allProductsRef = useRef([]); // Ref para almacenar los productos originales

  // Guardamos los productos originales una sola vez en el ref
  useEffect(() => {
    if (allProductsRef.current.length === 0) {
      allProductsRef.current = productos; // Guardamos los productos iniciales solo una vez
    }
  }, [productos]);

  // Función para aplicar los filtros de orden
  const applyFilters = () => {
    let products = [...allProductsRef.current];
    let idioma = localStorage.getItem("language") || "es"; // Idioma predeterminado

    // Aplicar filtro de búsqueda
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      products = products.filter((producto) => {
        // Validar y buscar en cada campo relevante
        const matchesNombre = producto.nombre[idioma]
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesDescripcion = producto.descripcion?.[idioma]
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesCategoria = producto.categoria?.[idioma]
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesTipoPrenda = producto.tipo_prenda?.[idioma]
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesColor = producto.color?.[idioma]
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesMaterial = producto.material?.[idioma]
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesMarca = producto.marca
          ?.toLowerCase()
          .includes(lowerCaseQuery);
        const matchesTalla = producto.talla
          ?.join(" ")
          .toLowerCase()
          .includes(lowerCaseQuery);

        // Retornar true si al menos uno coincide
        return (
          matchesNombre ||
          matchesDescripcion ||
          matchesCategoria ||
          matchesTipoPrenda ||
          matchesColor ||
          matchesMaterial ||
          matchesMarca ||
          matchesTalla
        );
      });
    }

    // Resto del código de filtros (sin cambios)
    if (selectedFilter === "discount" || selectedFilter === "discount2") {
      products = products.filter(
        (producto) => producto.rebaja && producto.descuento > 0
      );
    }

    switch (selectedFilter) {
      case "discount":
        products.sort((a, b) => b.descuento - a.descuento);
        break;
      case "discount2":
        products.sort((a, b) => a.descuento - b.descuento);
        break;
      case "alphabetical":
        products.sort((a, b) =>
          a.nombre[idioma]?.localeCompare(b.nombre[idioma])
        );
        break;
      case "alphabetical2":
        products.sort((a, b) =>
          b.nombre[idioma]?.localeCompare(a.nombre[idioma])
        );
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
          placeholder={translate("search_placeholder")} // Usamos translate para el placeholder
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
        <h4>{translate("filter_by")}</h4>{" "}
        {/* Usamos translate para el título de filtros */}
        <select onChange={handleFilterChange} value={selectedFilter}>
          <option value="">{translate("select_filter")}</option>{" "}
          {/* Usamos translate para la opción predeterminada */}
          <option value="alphabetical">{translate("alphabetical_A_Z")}</option>
          <option value="alphabetical2">{translate("alphabetical_Z_A")}</option>
          <option value="priceLowToHigh">
            {translate("price_low_to_high")}
          </option>
          <option value="priceHighToLow">
            {translate("price_high_to_low")}
          </option>
          <option value="discount">{translate("discount_high_to_low")}</option>
          <option value="discount2">{translate("discount_low_to_high")}</option>
          <option value="stock">{translate("stock_high_to_low")}</option>
          <option value="stock2">{translate("stock_low_to_high")}</option>
        </select>
      </div>
    </div>
  );
}

export default Search;
