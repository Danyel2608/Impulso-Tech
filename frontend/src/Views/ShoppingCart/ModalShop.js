import React from "react";
import ReactDOM from "react-dom";
import "./ModalShop.css";

function ModalShop({ visible, onClose, message }) {
  if (!visible) return null;

  // Determina la clase que se aplicará al mensaje
  const messageClass = message === "Producto añadido al carrito correctamente."
    ? "primera-vez modal-shop-content"
    : message === "Este producto ya está en el carrito."
    ? "segunda-vez modal-shop-content"
    : "";
  
  return ReactDOM.createPortal(
    <div className="modal-shop-overlay" onClick={onClose}>
      <div className={messageClass} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button className="close-modal" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>,
    document.querySelector("#modal")
  );
}

export default ModalShop;
