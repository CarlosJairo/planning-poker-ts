import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "./Card";

describe("Card component", () => {
  const mockCard = {
    id: "1",
    str: "Card 1",
    value: 10,
  };

  it("should render the card with provided children", () => {
    render(
      <Card card={mockCard} onClick={() => {}}>
        Card Content
      </Card>
    );
    const cardElement = screen.getByText("Card Content");
    expect(cardElement).toBeInTheDocument();
  });

  it("should call onClick with the correct card when clicked", () => {
    const handleClick = jest.fn();
    render(
      <Card card={mockCard} onClick={handleClick}>
        Card Content
      </Card>
    );
    const cardElement = screen.getByText("Card Content");
    fireEvent.click(cardElement);
    expect(handleClick).toHaveBeenCalledWith(mockCard);
  });

  it("should toggle the 'selected' class when clicked", () => {
    render(
      <Card card={mockCard} onClick={() => {}}>
        Card Content
      </Card>
    );
    const cardElement = screen.getByText("Card Content");

    // Inicialmente, no debería tener la clase "selected"
    expect(cardElement).not.toHaveClass("selected");

    // Hacer clic para seleccionar
    fireEvent.click(cardElement);
    expect(cardElement).toHaveClass("selected");

    // Hacer clic nuevamente para deseleccionar
    fireEvent.click(cardElement);
    expect(cardElement).not.toHaveClass("selected");
  });

  it("should apply the provided className", () => {
    render(
      <Card card={mockCard} onClick={() => {}} className="test-class">
        Card Content
      </Card>
    );
    const cardElement = screen.getByText("Card Content");
    expect(cardElement).toHaveClass("test-class");
  });
});
