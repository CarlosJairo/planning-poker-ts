import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import CardResultsCtn from "./CardResultsCtn";
import "@testing-library/jest-dom";

describe("CardResultsCtn", () => {
  test("should render CardResultsCtn and display the section", () => {
    // Renderiza el componente envuelto en el Provider
    render(
      <Provider store={store}>
        <CardResultsCtn />
      </Provider>
    );

    // Verifica que la sección principal está en el documento usando document.querySelector
    const section = document.querySelector(".o-card-results");
    expect(section).toBeInTheDocument();

    // Verifica que el texto que contiene 'Promedio' está en el documento
    const resultSection = document.querySelector(".o-card-results__results");
    expect(resultSection).toHaveTextContent(/Promedio/i);
  });
});
