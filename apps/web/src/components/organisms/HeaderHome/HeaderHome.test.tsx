import { render, screen } from "@testing-library/react";
import HeaderHome from "./HeaderHome"; // Asegúrate de que la ruta sea correcta
import "@testing-library/jest-dom";

describe("HeaderHome", () => {
  test("renders HeaderHome component", () => {
    render(<HeaderHome />);

    // Verifica si el logo y el texto se renderizan correctamente
    const logoElement = document.querySelector("svg");
    const headingElement = screen.getByText(/Crear partida/i);

    expect(logoElement).toBeInTheDocument();
    expect(headingElement).toBeInTheDocument();
  });
});
