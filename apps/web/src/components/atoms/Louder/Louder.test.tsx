import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Louder from "./Louder";

describe("Louder component", () => {
  it("should render the SVG and circles correctly", () => {
    render(<Louder />);

    // Verifica que el SVG con la clase correcta se renderiza
    const svgElement = screen.getByRole("img"); // Usa 'role="img"' para el SVG
    expect(svgElement).toHaveClass("louder");

    // Verifica que los círculos están presentes
    const circles = svgElement.querySelectorAll("circle");
    expect(circles).toHaveLength(4); // Verifica el número de círculos que se deben renderizar
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute("r", "13.4556");
      expect(circle).toHaveAttribute("fill", "#6429CD");
    });
  });
});
