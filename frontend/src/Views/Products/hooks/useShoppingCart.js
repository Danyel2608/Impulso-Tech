import { useState } from "react";
import { useTranslation } from "../../../TranslationContext";

const useShoppingCart = (producto, selectSize) => {
  const { translate } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const agregarAlCarrito = (producto, selectSize) => {
    const listItems = document.getElementById("listItems");
    const rowId = `row-number-${producto._id}`;
    const tokenAccessUser = localStorage.getItem("token");

    if (!tokenAccessUser) {
      setModalMessage(translate("login_required_message"));
      setIsModalVisible(true);
      return;
    }

    const alreadyInCart = document.getElementById(rowId);
    if (alreadyInCart) {
      setModalMessage(translate("product_already_in_cart_message"));
      setIsModalVisible(true);
      return;
    }

    if (!selectSize) {
      setModalMessage(translate("Talla no recibida"));
      setIsModalVisible(true);
      return;
    }

    const cartRow = document.createElement("div");
    cartRow.setAttribute("id", rowId);
    cartRow.classList.add("items-shop");

    let quantity = 1;
    const contentItem = `
    <div class="item-content">
      <div class="img-item">
        <img src=${producto.imagen_url} alt="${producto.nombre}" />
      </div>
      <div class="name-item"><h5>${producto.nombre}</h5></div>
      <div class="size-item"><h5>${selectSize}</h5></div> <!-- Usa la talla seleccionada -->
      <div class="price-item"><h5>${producto.precio.toFixed(2)}/und</h5></div>
      <div class="buttons-quantity">
        <div class="plus"><i class="fa-solid fa-plus" id="plus"></i></div>
        <div class="quantity"><p class="quantity-value">${quantity}</p></div>
        <div class="rest"><i class="fa-solid fa-minus" id="rest"></i></div>
      </div>
    </div>
  `;
    cartRow.innerHTML = contentItem;
    listItems.appendChild(cartRow);

    const newProduct = {
      imagen: producto.imagen_url,
      name: producto.nombre,
      talla: selectSize,
      precio: producto.precio,
      quantity: 1,
    };
    // Obtener el carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem("itemsCart")) || [];

    // Agregar el nuevo producto al carrito
    currentCart.push(newProduct);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("itemsCart", JSON.stringify(currentCart));

    const updateTotal = () => {
      let total = 0;
      const cartItems = document.querySelectorAll(".items-shop");
      cartItems.forEach((item) => {
        const price = parseFloat(
          item.querySelector(".price-item h5").textContent.slice(0)
        );
        const qty = parseInt(item.querySelector(".quantity p").textContent);
        total += price * qty;
      });
      document.getElementById("total-cart").textContent = `${total.toFixed(2)}`;
    };

    cartRow.querySelector(".fa-plus").addEventListener("click", () => {
      quantity++;
      cartRow.querySelector(".quantity-value").textContent = quantity;
      updateTotal();
    });

    cartRow.querySelector(".fa-minus").addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        cartRow.querySelector(".quantity-value").textContent = quantity;
        updateTotal();
      } else {
        cartRow.remove();
        updateTotal();
      }
    });

    updateTotal();
    setModalMessage(translate("product_added_message"));
    setIsModalVisible(true);
  };

  return {
    agregarAlCarrito,
    isModalVisible,
    modalMessage,
    setIsModalVisible,
    setModalMessage,
  };
};

export default useShoppingCart;
