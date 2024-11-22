import React, { useState } from "react";
import "./ShoppingCart.css";

function ShoppingCart() {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  ); // Recupera el carrito desde localStorage

  // Función para aumentar la cantidad de un producto
  const aumentarCantidad = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.id === id
          ? { ...producto, cantidad: producto.cantidad + 1 }
          : producto
      )
    );
  };

  // Función para disminuir la cantidad de un producto
  const disminuirCantidad = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((producto) =>
        producto.id === id && producto.cantidad > 1
          ? { ...producto, cantidad: producto.cantidad - 1 }
          : producto
      )
    );
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((producto) => producto.id !== id)
    );
  };

  // Calcular el total del carrito
  const calcularTotal = () => {
    return carrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  };
  const closeCart=()=>{
    let shoppingCart = document.getElementById("shopping-cart");
    console.log(shoppingCart);
    shoppingCart.classList.remove("visible");
    shoppingCart.classList.add("invisible");
  }

  return (
    <div className="shopping-cart invisible" id="shopping-cart">
      <h2>Cesta de la Compra</h2>
      <button className="close-cart" onClick={closeCart}><h4>Cerrar</h4></button>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        carrito.map((producto) => (
          <div key={producto.id} className="cart-item">
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h4>{producto.nombre}</h4>
              <p>Precio: ${producto.precio.toFixed(2)}</p>
              <div className="quantity-controls">
                <button onClick={() => disminuirCantidad(producto.id)}>
                  -
                </button>
                <span>{producto.cantidad}</span>
                <button onClick={() => aumentarCantidad(producto.id)}>+</button>
              </div>
              <p>Total: ${(producto.precio * producto.cantidad).toFixed(2)}</p>
              <button onClick={() => eliminarProducto(producto.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}

      <div className="total">
        <h3>Total: ${calcularTotal().toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default ShoppingCart;
