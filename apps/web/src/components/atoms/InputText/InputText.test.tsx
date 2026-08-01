import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputText from "./InputText";

describe("InputText component", () => {
  it("should render with the correct props and handle change event", () => {
    const handleChange = jest.fn();

    render(
      <InputText
        id="test-input"
        name="test-name"
        value="test-value"
        onChange={handleChange}
        data-testid="input-text"
      />
    );

    const inputElement = screen.getByTestId("input-text");

    expect(inputElement).toHaveAttribute("type", "text");
    expect(inputElement).toHaveAttribute("name", "test-name");
    expect(inputElement).toHaveAttribute("id", "test-input");
    expect(inputElement).toHaveValue("test-value");

    fireEvent.change(inputElement, { target: { value: "new-value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
