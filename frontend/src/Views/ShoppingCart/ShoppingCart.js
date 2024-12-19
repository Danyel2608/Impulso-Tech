import React, { useEffect, useState } from "react";
import "./ShoppingCart.css";
import ModalCart from "./ModalCart";
// Asegúrate de importar correctamente tu función translate o el contexto
import { useTranslation } from "../../TranslationContext"; // Importamos tu contexto de traducción

function ShoppingCart() {
  const { translate } = useTranslation(); // Usamos el translate de tu contexto

  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [modalMessage2, setModalMessage2] = useState("");
  const [cartItems, setCartItems] = useState([]);
  // 1. Cargar los datos de `localStorage` al montar el componente
  useEffect(() => {
    const isLogin = localStorage.getItem("token");
    if (isLogin !== null) {
      // Revisamos si ya hay algo guardado en localStorage
      const savedItems = localStorage.getItem("itemsCart");

      // Si hay datos, los parseamos y los asignamos al estado
      if (savedItems) {
        setCartItems(JSON.parse(savedItems)); // Convierte el string a un array de objetos
      }
    }
  }, []); // Solo se ejecuta una vez, cuando el componente se monta

  // 2. Guardar el carrito de compras en `localStorage` cada vez que el estado cambie
  useEffect(() => {
    const isLogin = localStorage.getItem("token");

    if (isLogin !== null) {
      // Guardamos los items del carrito solo si hay algo en el estado
      if (cartItems.length > 0) {
        localStorage.setItem("itemsCart", JSON.stringify(cartItems)); // Guardamos el carrito en localStorage como JSON
      }
    }
  }, [cartItems]); // Este efecto se ejecuta cada vez que el estado 'cartItems' cambia

  const closeCart = () => {
    let shopping = document.getElementById("shopping-cart");
    shopping.classList.remove("visible");
    shopping.classList.add("invisible");
  };

  const emptyCart = () => {
    setCartItems([]); // Vaciar el carrito en el estado
    localStorage.removeItem("itemsCart");
  };

  const handlePurchase = async () => {
    let tokenAccess = localStorage.getItem("token");
    if (!tokenAccess) {
      setModalMessage2(translate("login_required_message"));
      setIsModalVisible2(true);
      return;
    }

    const itemsCart = cartItems;
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));
    const recipientEmail = user.data.user.email;

    if (!itemsCart || itemsCart.length === 0) {
      setModalMessage2(translate("empty_cart_message"));
      setIsModalVisible2(true);
      return;
    }

    try {
      const response = await fetch("/invoice/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemsCart,
          token,
          recipientEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || translate("purchase_error_message"));
      }

      const data = await response.json();
      console.log("Server response:", data);
      setModalMessage2(translate("invoice_sent_message"));
      setIsModalVisible2(true);
      emptyCart();
    } catch (error) {
      console.error("Error during purchase:", error);
      setModalMessage2(translate("purchase_error_message"));
      setIsModalVisible2(true);
    }
  };

  const addQuantity = (e) => {
    // Buscar el producto que contiene el botón "+" usando document.querySelector
    const productElement = e.target.parentNode.parentNode.parentNode;
    const productId =
      e.target.parentNode.parentNode.parentNode.children[1].children[0].textContent.trim(); // Obtenemos el nombre del producto

    const quantityElement = productElement.querySelector(".quantity-value");
    let quantity = parseInt(quantityElement.textContent);

    // Aumentamos la cantidad
    quantity++;

    // Actualizamos la cantidad en el DOM
    quantityElement.textContent = quantity;

    // Actualizamos la cantidad en el carrito (estado + localStorage)
    updateCartQuantity(productId, quantity);
  };

  const restQuantity = (e) => {
    // Buscar el producto que contiene el botón "-" usando document.querySelector
    const productElement = e.target.parentNode.parentNode.parentNode;
    const productId =
      e.target.parentNode.parentNode.parentNode.children[1].children[0].textContent.trim(); // Obtenemos el nombre del producto
    const quantityElement = productElement.querySelector(".quantity-value");
    let quantity = parseInt(quantityElement.textContent);

    // Reducimos la cantidad
    quantity--;

    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminamos el producto
      removeProductFromCart(productId);
    } else {
      // Actualizamos la cantidad en el DOM
      quantityElement.textContent = quantity;

      // Actualizamos la cantidad en el carrito (estado + localStorage)
      updateCartQuantity(productId, quantity);
    }
  };

  // Función para actualizar la cantidad del producto en el carrito (estado + localStorage)
  const updateCartQuantity = (productId, newQuantity) => {
    // Encontramos el índice del producto en cartItems usando el productId
    const productIndex = cartItems.findIndex((item) => item.name === productId);

    if (productIndex !== -1) {
      // Actualizamos la cantidad directamente en el estado
      const updatedItems = [...cartItems];
      updatedItems[productIndex].quantity = newQuantity;
      setCartItems(updatedItems); // Actualizamos el estado del carrito

      // Luego guardamos el estado actualizado en localStorage
      localStorage.setItem("itemsCart", JSON.stringify(updatedItems));
    }
  };

  // Función para eliminar un producto del carrito
  const removeProductFromCart = (productId) => {
    // Filtramos el array para remover el producto por su productId
    const updatedCart = cartItems.filter((item) => item.name !== productId);

    // Actualizamos el estado del carrito y el localStorage
    setCartItems(updatedCart);
    localStorage.setItem("itemsCart", JSON.stringify(updatedCart));
  };

  return (
    <div className="shopping-cart invisible" id="shopping-cart">
      <button className="close-cart" onClick={closeCart}>
        X
      </button>
      <div className="shopping-title">
        <h3>{translate("cart_title")}</h3>
      </div>
      <div className="product-cart-index">
        <table>
          <thead>
            <tr>
              <th>{translate("imagen")}</th>
              <th>{translate("nombre")}</th>
              <th>{translate("talla")}</th>
              <th>{translate("precio")}</th>
              <th>{translate("unidad")}</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Aquí mapeamos los items del carrito */}
      <div id="listItems">
        {cartItems.length > 0
          ? cartItems.map((product, index) => (
              <div key={index} className="item-content">
                <div className="img-item">
                  <img
                    src={product.imagen} // Se espera que cada producto tenga una propiedad 'image'
                    alt={product.name} // Se espera que cada producto tenga una propiedad 'name'
                  />
                </div>
                <div className="name-item">
                  <h5>{product.name}</h5> {/* Nombre del producto */}
                </div>
                <div className="size-item">
                  <h5>{product.talla}</h5> {/* Talla seleccionada */}
                </div>
                <div className="price-item">
                  <h5>{product.precio.toFixed(2)}/und</h5>{" "}
                  {/* Precio del producto */}
                </div>
                <div className="buttons-quantity">
                  <div className="plus">
                    <i
                      className="fa-solid fa-plus"
                      id="plus"
                      onClick={addQuantity}
                    ></i>
                  </div>
                  <div className="quantity">
                    <p className="quantity-value">{product.quantity}</p>{" "}
                    {/* Cantidad seleccionada */}
                  </div>
                  <div className="rest">
                    <i
                      className="fa-solid fa-minus"
                      id="rest"
                      onClick={restQuantity}
                    ></i>
                  </div>
                </div>
              </div>
            ))
          : ""}
      </div>

      <div className="shopping-actions-container">
        <div className="cart-summary">
          <h4>{translate("total")}</h4>
          <div className="price-content">
            <h4 id="total-cart">
              {cartItems
                .reduce(
                  (total, product) => total + product.precio * product.quantity,
                  0
                )
                .toFixed(2)}
            </h4>
            <h4>{translate("moneda")}</h4>
          </div>
        </div>
        <div className="shopping-buttons">
          <button className="btn-empty" onClick={emptyCart}>
            {translate("empty_cart_button")}
          </button>
          <button className="btn-buy" onClick={handlePurchase}>
            {translate("buy_button")}
          </button>
        </div>
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
