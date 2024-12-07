import React from "react";
import ReactDOM from "react-dom";
import "./ModalShop.css";
import { useTranslation } from "../../TranslationContext"; // Importamos tu contexto de traducción

function ModalShop({ visible, onClose, message }) {
  const { translate } = useTranslation(); // Usamos el translate de tu contexto

  if (!visible) return null;

  // Determina la clase que se aplicará al mensaje
  const messageClass =
    message === translate("product_added_message")
      ? "primera-vez modal-shop-content"
      : message === translate("product_already_in_cart_message")
      ? "segunda-vez modal-shop-content"
      : message === translate("login_required_message")
      ? "modal-shop-content"
      : message === translate("size_neccesary")
      ? "modal-shop-content"
      : "";

  return ReactDOM.createPortal(
    <div className="modal-shop-overlay" onClick={onClose}>
      <div className={messageClass} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button className="close-modal" onClick={onClose}>
          {translate("close_button")} {/* Usamos translate en lugar de t() */}
        </button>
      </div>
    </div>,
    document.querySelector("#modal") // El contenedor del modal
  );
}

export default ModalShop;
