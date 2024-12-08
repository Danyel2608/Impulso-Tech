import React, { useEffect, useState } from "react";
import "./AdminPage.css"; // Asegúrate de tener un archivo CSS con los estilos que mencionas
import HeaderLangugages from "../Header/HeaderLanguages";
const ProductsTable = ({ translate }) => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8001/api/all-products");
        if (!response.ok) {
          throw new Error(translate("error_fetching_products"));
        }
        const data = await response.json();
        const language = localStorage.getItem("language");
        const translatedProducts = data.products.map((product) => ({
          ...product,
          nombre: product.nombre[language],
          descripcion: product.descripcion[language],
          categoria: product.categoria[language],
          tipo_prenda: product.tipo_prenda[language],
          talla: product.talla,
          color: product.color[language],
          material: product.material[language],
        }));
        setProductos(translatedProducts);
        setProductosFiltrados(translatedProducts);
      } catch (error) {
        console.error(translate("error_fetching_products"), error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [translate]);

  if (isLoading) {
    return <p className="admin-page-loading">Loading...</p>;
  }

  return (
    <div className="admin-page">
      <HeaderLangugages></HeaderLangugages>
      <h1>Product Table</h1>
      <table className="admin-page-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Tipo de Prenda</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Material</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{producto.tipo_prenda}</td>
              <td>{producto.talla.join(",")}</td>
              <td>{producto.color}</td>
              <td>{producto.material}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
