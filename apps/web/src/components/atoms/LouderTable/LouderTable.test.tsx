import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LouderTable from "./LouderTable";

describe("LouderTable component", () => {
  it("should render the Louder component and the text correctly", () => {
    render(<LouderTable />);

    // Verifica que el componente Louder está presente
    const louderComponent = screen.getByRole("img"); // Asumiendo que el SVG tiene el rol "img"
    expect(louderComponent).toBeInTheDocument();

    // Verifica que el párrafo con el texto está presente
    const paragraph = screen.getByText("Contando votos");
    expect(paragraph).toBeInTheDocument();
  });
});
