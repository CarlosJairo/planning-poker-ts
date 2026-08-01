import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputRadio from "./InputRadio";

describe("InputRadio component", () => {
  it("should render with the correct props and handle change event", () => {
    const handleChange = jest.fn();

    render(
      <InputRadio
        name="test-radio"
        value="option1"
        checked={false}
        onChange={handleChange}
      />
    );

    const radioElement = screen.getByRole("radio");

    // verificar si tienen todos los atributos necesarios
    expect(radioElement).toHaveAttribute("type", "radio");
    expect(radioElement).toHaveAttribute("name", "test-radio");
    expect(radioElement).toHaveAttribute("value", "option1");
    expect(radioElement).not.toBeChecked();

    // Simular el evento change
    fireEvent.click(radioElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
