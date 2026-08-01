import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ButtonSubmit from "./ButtonSubmit";

describe("ButtonSubmit component", () => {
  it("should not be disabled by default", () => {
    render(<ButtonSubmit>Submit</ButtonSubmit>);
    const buttonElement = screen.getByText("Submit");
    expect(buttonElement).not.toBeDisabled();
  });

  it("should be disabled when the disabled prop is true", () => {
    render(<ButtonSubmit disabled={true}>Submit</ButtonSubmit>);
    const buttonElement = screen.getByText("Submit");
    expect(buttonElement).toBeDisabled();
  });
});
