import React from "react";
import classes from "./Modal.module.css";

function ModalForget({ visible, header, message, isSuccess, onClose }) {
  return (
    <>
      <div
        className={`${classes["md-modal"]} ${
          visible ? classes["md-show"] : ""
        }`}
      >
        <div
          className={`${classes["md-content"]} ${
            isSuccess ? classes.success : classes.danger
          }`}
        >
          <h3>{header}</h3>
          <div>
            <p>{message}</p>
            <button onClick={onClose} className={classes["md-close"]}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
      <div className={classes["md-overlay"]} />
    </>
  );
}

export default ModalForget;
