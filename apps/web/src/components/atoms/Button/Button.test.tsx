import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";
import "@testing-library/jest-dom";

describe("Button component", () => {
  it("Deberia reenderizar el boton con la prop children", () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText("Click Me");
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
