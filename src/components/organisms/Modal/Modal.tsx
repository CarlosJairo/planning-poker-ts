import React from "react";
import "./Modal.css";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen }) => {
  return (
    <article
      className={`modal-overlay ${isOpen ? "is-active" : ""}`}
      role="dialog"
    >
      <div className="modal-content">{children}</div>
    </article>
  );
};

export default Modal;
