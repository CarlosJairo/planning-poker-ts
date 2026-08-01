import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";

describe("Modal", () => {
  test("renders the modal with content when isOpen is true", () => {
    render(
      <Modal isOpen={true}>
        <p>Modal Content</p>
      </Modal>
    );

    // Check if the modal is visible and contains the content
    const modalElement = document.querySelector(".o-modal");
    const contentElement = document.querySelector(".o-modal__content p");

    expect(modalElement).toBeInTheDocument();
    expect(modalElement).toHaveClass("o-modal--is-active");
    expect(contentElement).toBeInTheDocument();
  });

  test("does not render the modal content when isOpen is false", () => {
    render(
      <Modal isOpen={false}>
        <p>Modal Content</p>
      </Modal>
    );

    // Check if the modal is present but without the active class
    const modalElement = document.querySelector(".o-modal");

    // Check if modal exists but without the 'o-modal--is-active' class
    expect(modalElement).toBeInTheDocument();
    expect(modalElement).not.toHaveClass("o-modal--is-active");
  });
});
