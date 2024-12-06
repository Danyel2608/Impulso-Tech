import React, { useState } from "react";
import "./ShoppingCart.css";
import ModalCart from "./ModalCart";
// Asegúrate de importar correctamente tu función translate o el contexto
import { useTranslation } from "../../TranslationContext"; // Importamos tu contexto de traducción

function ShoppingCart() {
  const { translate } = useTranslation(); // Usamos el translate de tu contexto

  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [modalMessage2, setModalMessage2] = useState("");

  // Aquí utilizamos el translate directamente
  const translateText = translate; // O bien, si es un contexto, lo usas directamente

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
    let itemsCart = document.querySelectorAll(".items-shop");

    const arrayItemsCart = [...itemsCart].map((item) => {
      return {
        id: item.id,
        name: item.querySelector(".name-item h5").textContent.trim(),
        price: parseFloat(
          item
            .querySelector(".price-item h5")
            .textContent.replace("$", "")
            .trim()
        ),
        quantity: parseInt(
          item.querySelector(".quantity-value").textContent.trim()
        ),
      };
    });

    localStorage.setItem("itemsCart", JSON.stringify(arrayItemsCart));

    console.log("Saved to LocalStorage:", arrayItemsCart);
  };

  const handlePurchase = async () => {
    let tokenAccess = localStorage.getItem("token");
    if (!tokenAccess) {
      setModalMessage2(translateText("login_required_message")); // Traducción personalizada para el mensaje
      setIsModalVisible2(true);
      return;
    }

    saveCart();

    const itemsCart = JSON.parse(localStorage.getItem("itemsCart"));
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));
    const recipientEmail = user.data.user.email;

    if (!itemsCart || itemsCart.length === 0) {
      setModalMessage2(translateText("empty_cart_message")); // Traducción personalizada para carrito vacío
      setIsModalVisible2(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8001/invoice/send-invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemsCart,
            token,
            recipientEmail,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || translateText("purchase_error_message")
        ); // Traducción del mensaje de error
      }

      const data = await response.json();
      console.log("Server response:", data);
      setModalMessage2(translateText("invoice_sent_message")); // Traducción del mensaje de factura enviada
      setIsModalVisible2(true);
      emptyCart();
    } catch (error) {
      console.error("Error during purchase:", error);
      setModalMessage2(translateText("purchase_error_message")); // Traducción del mensaje de error de compra
      setIsModalVisible2(true);
    }
  };

  return (
    <div className="shopping-cart invisible" id="shopping-cart">
      <button className="close-cart" onClick={closeCart}>
        X
      </button>
      <div className="shopping-title">
        <h3>{translateText("cart_title")}</h3>{" "}
        {/* Título del carrito traducido */}
      </div>
      <ul id="listItems"></ul>
      <div className="cart-summary">
        <h4>{translateText("total")}</h4> {/* Total traducido */}
        <h4 id="total-cart">$0.00</h4>
      </div>
      <div className="shopping-buttons">
        <button className="btn-empty" onClick={emptyCart}>
          {translateText("empty_cart_button")} {/* Botón vacío traducido */}
        </button>
        <button className="btn-buy" onClick={handlePurchase}>
          {translateText("buy_button")} {/* Botón comprar traducido */}
        </button>
      </div>
      <ModalCart
        visible={isModalVisible2}
        onClose={() => setIsModalVisible2(false)}
        message={modalMessage2}
      />
    </div>
  );
}

export default ShoppingCart;
