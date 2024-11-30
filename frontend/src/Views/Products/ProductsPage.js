import React, { useState, useEffect } from "react";
import "./ProductsPage.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Search from "./Search";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import ModalShop from "../ShoppingCart/ModalShop"; // Importa el ModalShop

function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productosVista, setProductosVista] = useState([]);
  const [cantidadCargada, setCantidadCargada] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8001/api/all-products");
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();
        setProductos(data.products || []);
        setProductosFiltrados(data.products || []);
      } catch (error) {
        console.error("Error al obtener los productos:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const productosAMostrar = productosFiltrados.slice(0, cantidadCargada);
    setProductosVista(productosAMostrar);
  }, [productosFiltrados, cantidadCargada]);

  const agregarAlCarrito = (producto) => {
    let listItems = document.getElementById("listItems");
    let cartRow = document.createElement("div");
    let rowId = "row-number-" + producto._id;
    cartRow.setAttribute("id", rowId);
    cartRow.classList.add("items-shop");

    let cartItems = document.querySelectorAll(".items-shop");
    let alreadyInCart = false;

    cartItems.forEach((item) => {
      if (item.getAttribute("id") === rowId) {
        alreadyInCart = true;
      }
    });

    if (alreadyInCart) {
      setModalMessage("Este producto ya está en el carrito.");
      setIsModalVisible(true);
      return;
    }

    let fotoCamiseta = encodeURIComponent(producto.imagen_url);
    let description = producto.nombre;
    let price = producto.precio;
    let quantity = 1;

    let contentItem = `
    <div class="item-content">
      <div class="img-item">
          <img src=${fotoCamiseta} alt=${description} />
      </div>
      <div class="name-item"><h5>${description}</h5></div>
      <div class="price-item"><h5>$${price.toFixed(2)}</h5></div>
      <div id="price-x-quantity">€/und</div>
      <div class="buttons-quantity">
        <div class="plus"><i class="fa-solid fa-plus" id="plus" ></i></div>
        <div class="quantity"><p class="quantity-value">${quantity}</p></div>
        <div class="rest"><i class="fa-solid fa-minus" id="rest"></i></div>
      </div>
    </div>
    `;

    cartRow.innerHTML = contentItem;
    listItems.appendChild(cartRow);

    cartRow.querySelector(".fa-plus").addEventListener("click", () => {
      quantity++;
      cartRow.querySelector(".quantity p").textContent = quantity;
      updateTotal();
    });

    cartRow.querySelector(".fa-minus").addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        cartRow.querySelector(".quantity p").textContent = quantity;
        updateTotal();
      } else {
        cartRow.remove();
        updateTotal();
      }
    });

    updateTotal();
    setModalMessage("Producto añadido al carrito correctamente.");
    setIsModalVisible(true);
  };

  const updateTotal = () => {
    let total = 0;
    // Obtén todos los divs dentro de listItems que contienen productos
    let cartItems = document.querySelectorAll(".items-shop");

    cartItems.forEach((item) => {
      // Extrae el precio del producto
      const price = parseFloat(
        item.querySelector(".price-item h5").textContent.slice(1) // Remueve el signo $ y convierte el precio a número
      );

      // Extrae la cantidad del producto
      const quantity = parseInt(item.querySelector(".quantity p").textContent);

      // Suma al total
      total += price * quantity;
    });

    // Actualiza el total en el carrito
    document.getElementById("total-cart").textContent = `$${total.toFixed(2)}`;
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
          {isLoading ? (
            <p>Cargando productos...</p>
          ) : productosVista.length === 0 ? (
            <h5>No se encontraron resultados para tu búsqueda.</h5>
          ) : (
            productosVista.map((producto) => (
              <div className="product-card" key={producto._id}>
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="product-image"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "producto",
                      JSON.stringify(producto)
                    ); // Pasa los datos del producto
                  }}
                />
                <div className="product-info">
                  <h4 className={`new ${producto.rebaja ? "new" : "no-new"}`}>
                    {producto.rebaja ? "Novedad" : ""}
                  </h4>
                  <h4 className="rebaja">-{producto.descuento}%</h4>
                </div>
                <h4>{producto.nombre}</h4>
                <p>${producto.precio.toFixed(2)}</p>
                <div className="product-buy">
                  <button onClick={() => agregarAlCarrito(producto)}>
                    <h4>Comprar</h4>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
      <ShoppingCart />
      <ModalShop
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message={modalMessage}
      />
    </div>
  );
}

export default ProductsPage;
