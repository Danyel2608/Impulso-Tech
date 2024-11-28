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
    let itemsCarts = document.querySelectorAll(".items-shop");
    console.log(itemsCarts.content);
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
        <button className="btn-buy" onClick={saveCart}>
          Comprar
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
