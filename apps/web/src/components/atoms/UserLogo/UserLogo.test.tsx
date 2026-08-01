import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserLogo from "./UserLogo";

describe("UserLogo component", () => {
  it("should render the first letter of the name", () => {
    const name = "Carlos";
    render(<UserLogo name={name} />);

    const userLogoElement = screen.getByText(name[0]);
    expect(userLogoElement).toBeInTheDocument();
  });

  it("should render '-' if the name is an empty string", () => {
    render(<UserLogo name="" />);

    const userLogoElement = screen.getByText("-");
    expect(userLogoElement).toBeInTheDocument();
  });
});
