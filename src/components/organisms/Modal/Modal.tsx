import React from "react";
import "./Modal.scss";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen }) => {
  return (
    <article
      className={`o-modal ${isOpen ? "o-modal--is-active" : ""}`}
      role="dialog"
    >
      <div className="o-modal__content">{children}</div>
    </article>
  );
};

export default Modal;
