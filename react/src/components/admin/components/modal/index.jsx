import React from "react";

import styles from "./modal.module.css"

const Modal = ({ children, open, onClose }) =>
  open ? (
    <>
      <div onClick={onClose} className={styles.modalBackground} />
      <div className={styles.modal}>
        <div onClick={onClose} className={styles.close}>
          &times;
        </div>
        {children}
      </div>
    </>
  ) : null;

export default Modal;
