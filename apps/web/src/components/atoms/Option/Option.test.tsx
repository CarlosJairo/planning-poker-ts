import { render, screen } from "@testing-library/react";
import Option from "./Option";
import "@testing-library/jest-dom";

describe("Option component", () => {
  it("should render with the correct value and children", () => {
    const value = "test-value";
    const children = "Test Option";

    render(<Option value={value}>{children}</Option>);

    // Verifica que el elemento <option> se renderiza con el valor correcto
    const optionElement = screen.getByRole("option");
    expect(optionElement).toHaveAttribute("value", value);

    // Verifica que el elemento <option> contiene el texto correcto
    expect(optionElement).toHaveTextContent(children);
  });
});
