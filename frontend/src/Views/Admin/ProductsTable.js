import React, { useEffect, useState } from "react";
import "./ProductsTable.css";
import HeaderLangugages from "../Header/HeaderLanguages";
import { useTranslation } from "../../TranslationContext";

const ProductsTable = () => {
  const { translate } = useTranslation();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // To track the product being edited
  const [updatedProduct, setUpdatedProduct] = useState({
    precio: "",
    talla: "",
    color: "",
    stock: "",
    descuento: "",
    novedad: false,
  });
  const currentLanguage = localStorage.getItem("language");

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/all-products");
      if (!response.ok) {
        throw new Error(translate("error_fetching_products"));
      }
      const data = await response.json();
      setProductos(data.products);
      setProductosFiltrados(data.products);
    } catch (error) {
      console.error(translate("error_fetching_products"), error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentLanguage]); // Reload products when language changes

  // Filter products based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setProductosFiltrados(productos);
      return;
    }

    const lowercasedSearchText = searchText.toLowerCase();

    const filtered = productos.filter((producto) =>
      Object.values(producto).some((value) =>
        Array.isArray(value)
          ? value.some((item) =>
              item.toString().toLowerCase().includes(lowercasedSearchText)
            )
          : value.toString().toLowerCase().includes(lowercasedSearchText)
      )
    );
    setProductosFiltrados(filtered);
  }, [searchText, productos]);

  // Handle product deletion
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch("/api/deleteId", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: productId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Producto eliminado exitosamente.");
        fetchProducts(); // Refresh product list after deletion
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const startEditing = (producto) => {
    console.log("Start Editing: ", producto.color); // Verifica si es un objeto o un string
    setEditingProduct(producto);
    setUpdatedProduct({
      precio: producto.precio,
      talla: producto.talla.join(", "),
      color: producto.color[currentLanguage] || "",
      stock: producto.stock,
      descuento: producto.descuento,
      novedad: producto.novedad,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Input Change: ", name, value); // Verifica lo que estás obteniendo
    setUpdatedProduct((prevState) => {
      if (name === "color") {
        return {
          ...prevState,
          color: value,
        };
      }

      return {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Corrected updateProduct function
  const updateProduct = async (productId, updatedData, currentLanguage) => {
    try {
      const dataToSend = { ...updatedData };

      // Convertir 'talla' de cadena a array
      if (dataToSend.talla) {
        dataToSend.talla = dataToSend.talla
          .split(",")
          .map((item) => item.trim());
      }

      // Manejar el color basado en idioma
      if (dataToSend.color) {
        dataToSend.color = { [currentLanguage]: dataToSend.color };
      }

      const response = await fetch("/api/updateProduct", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: productId,
          updates: dataToSend,
          lang: currentLanguage,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Producto actualizado exitosamente.");
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  // Cancel the editing
  const cancelEditing = () => {
    setEditingProduct(null); // Cancel editing
  };

  // Loading state
  if (isLoading) {
    return (
      <p className="admin-page-loading">{translate("loading_products")}</p>
    );
  }

  return (
    <div className="admin-page">
      <HeaderLangugages />
      <h1>{translate("product_table")}</h1>

      {/* Search input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={translate("search_placeholder")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Product table */}
      <table className="admin-page-table">
        <thead>
          <tr>
            <th>{translate("id_label")}</th>
            <th>{translate("name_label")}</th>
            <th>{translate("price_label")}</th>
            <th>{translate("category_label")}</th>
            <th>{translate("type_label")}</th>
            <th>{translate("size_label")}</th>
            <th>{translate("color_label")}</th>
            <th>{translate("material_label")}</th>
            <th>{translate("stock_label")}</th>
            <th>{translate("discount_label")}</th>
            <th>{translate("novelty_label")}</th>
            <th>{translate("edit_label")}</th>
            <th>{translate("delete_label")}</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto._id}>
              <td>{producto._id}</td>
              <td>{producto.nombre[currentLanguage]}</td>
              <td>{producto.precio}</td>
              <td>{producto.categoria[currentLanguage]}</td>
              <td>{producto.tipo_prenda[currentLanguage]}</td>
              <td>{producto.talla.join(", ")}</td>
              <td>{producto.color[currentLanguage]}</td>
              <td>{producto.material[currentLanguage]}</td>
              <td>{producto.stock}</td>
              <td>{producto.descuento}%</td>
              <td>
                {producto.novedad
                  ? translate("yes_label")
                  : translate("no_label")}
              </td>
              <td>
                <i
                  className="fa-solid fa-pen"
                  onClick={() => startEditing(producto)}
                ></i>
              </td>
              <td>
                <i
                  className="fa-solid fa-trash"
                  onClick={() => deleteProduct(producto._id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit product form */}
      {editingProduct && (
        <div className="edit-product-form">
          <form onSubmit={(e) => e.preventDefault()}>
            <label>{translate("price_label")}</label>
            <input
              type="number"
              name="precio"
              value={updatedProduct.precio}
              onChange={handleInputChange}
            />
            <label>{translate("size_label")}</label>
            <input
              type="text"
              name="talla"
              value={updatedProduct.talla}
              onChange={handleInputChange}
            />
            <label>{translate("color_label")}</label>
            <input
              type="text"
              name="color"
              value={updatedProduct.color} // El valor será ahora un string, no un objeto
              onChange={handleInputChange}
            />

            <label>{translate("stock_label")}</label>
            <input
              type="number"
              name="stock"
              value={updatedProduct.stock}
              onChange={handleInputChange}
            />
            <label>{translate("discount_label")}</label>
            <input
              type="number"
              name="descuento"
              value={updatedProduct.descuento}
              onChange={handleInputChange}
            />
            <div className="novedad-edit">
              <label>{translate("novelty_label")}</label>
              <input
                type="checkbox"
                name="novedad"
                checked={updatedProduct.novedad}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                updateProduct(
                  editingProduct._id,
                  updatedProduct,
                  currentLanguage
                )
              }
            >
              {translate("update_product")}
            </button>
            <button type="button" onClick={cancelEditing}>
              {translate("cancel")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
