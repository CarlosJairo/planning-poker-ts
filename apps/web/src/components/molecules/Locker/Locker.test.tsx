import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Locker from "./Locker";

describe("Locker component", () => {
  test("renders children correctly", () => {
    render(
      <Locker>
        <span>Test Child</span>
      </Locker>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  test("applies the className prop correctly", () => {
    render(
      <Locker className="custom-class">
        <span>Another Child</span>
      </Locker>
    );

    const lockerDiv = screen.getByText("Another Child").parentElement;
    expect(lockerDiv).toHaveClass("custom-class");
  });
});
