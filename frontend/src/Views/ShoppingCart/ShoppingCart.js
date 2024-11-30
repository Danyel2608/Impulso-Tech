import React from "react";
import "./ShoppingCart.css";

function ShoppingCart() {
  const closeCart = () => {
    let shopping = document.getElementById("shopping-cart");
    shopping.classList.remove("visible");
    shopping.classList.add("invisible");
  };
  const emptyCart = () => {
    let listItems = document.getElementById("listItems");
    listItems.innerHTML = "";
    let totalCount = document.getElementById("total-cart");
    totalCount.innerHTML = "$0.00";
  };
  const saveCart = () => {
    // Selecciona todos los elementos con la clase "items-shop"
    let itemsCart = document.querySelectorAll(".items-shop");

    // Procesa cada elemento para extraer la información relevante
    const arrayItemsCart = [...itemsCart].map((item) => {
      return {
        id: item.id, // ID del elemento
        name: item.querySelector(".name-item h5").textContent.trim(), // Nombre del producto
        price: parseFloat(
          item
            .querySelector(".price-item h5")
            .textContent.replace("$", "")
            .trim()
        ), // Precio del producto
        quantity: parseInt(
          item.querySelector(".quantity-value").textContent.trim()
        ), // Cantidad
      };
    });

    // Guarda el array procesado en LocalStorage
    localStorage.setItem("itemsCart", JSON.stringify(arrayItemsCart));

    console.log("Guardado en LocalStorage:", arrayItemsCart);
  };
  const handlePurchase = async () => {
    let tokenAccess = localStorage.getItem("token");
    if (!tokenAccess) {
      alert("Tienes que iniciar sesión primero");
      return;
    }
    // Llama a saveCart para asegurar que los datos estén actualizados
    saveCart();

    // Recupera los datos del carrito y el token del LocalStorage
    const itemsCart = JSON.parse(localStorage.getItem("itemsCart"));
    const token = localStorage.getItem("token");

    // Recupera el correo del usuario desde el localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const recipientEmail = user.data.user.email;

    if (!itemsCart || itemsCart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    if (!recipientEmail) {
      alert("No se encontró el correo del usuario.");
      return;
    }

    try {
      // Envía una solicitud al backend con el carrito, el token y el email
      const response = await fetch(
        "http://localhost:8001/invoice/send-invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemsCart, // Enviar los datos del carrito al backend
            token, // Incluir el token de autenticación
            recipientEmail, // Incluir el correo del destinatario
          }),
        }
      );

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json(); // Lee el cuerpo de la respuesta en caso de error
        throw new Error(errorData.error || "Error al procesar la compra");
      }

      // Si la respuesta es exitosa, procesar los datos JSON
      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      alert("Factura enviada exitosamente.");
      emptyCart(); // Vacía el carrito después de la compra
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert(
        "Ocurrió un error al realizar la compra. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <div className="shopping-cart invisible" id="shopping-cart">
      <button className="close-cart" onClick={closeCart}>
        X
      </button>
      <div className="shopping-title">
        <h3>CARRITO</h3>
      </div>
      <ul id="listItems"></ul>
      <div className="cart-summary">
        <h4>Total:</h4>
        <h4 id="total-cart">$0.00</h4>
      </div>
      <div className="shopping-buttons">
        <button className="btn-empty" onClick={emptyCart}>
          Vaciar Carrito
        </button>
        <button className="btn-buy" onClick={handlePurchase}>
          Comprar
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
