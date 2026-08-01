import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Label from "./Label";

describe("Label component", () => {
  it("should render with the correct htmlFor and children", () => {
    render(
      <Label htmlFor="test-input" data-testid="label">
        Test Label
      </Label>
    );

    const labelElement = screen.getByTestId("label");

    // Verifica que el label tenga el atributo for correcto
    expect(labelElement).toHaveAttribute("for", "test-input");

    // Verifica que el label contenga el texto correcto
    expect(labelElement).toHaveTextContent("Test Label");
  });
});
