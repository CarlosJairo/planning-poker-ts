import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CardOnTable from "./CardOnTable";

describe("CardOnTable component", () => {
  it("should render with the base class by default", () => {
    render(<CardOnTable voted={false} revealedCards={false} />);
    const cardElement = screen.getByTestId("card-on-table");
    expect(cardElement).toHaveClass("a-card-on-table");
  });

  it("should apply the selected class if voted is an object", () => {
    render(
      <CardOnTable
        voted={{ id: "1", str: "5", value: 5 }}
        revealedCards={false}
      />
    );
    const cardElement = screen.getByTestId("card-on-table");
    expect(cardElement).toHaveClass("a-card-on-table--selected");
  });

  it("should apply the show class if revealedCards is true", () => {
    render(
      <CardOnTable
        voted={{ id: "1", str: "5", value: 5 }}
        revealedCards={true}
      />
    );
    const cardElement = screen.getByTestId("card-on-table");
    expect(cardElement).toHaveClass("a-card-on-table--show");
  });

  it("should display the string from voted if revealedCards is true and voted is an object", () => {
    render(
      <CardOnTable
        voted={{ id: "1", str: "5", value: 5 }}
        revealedCards={true}
      />
    );
    const cardElement = screen.getByTestId("card-on-table");
    expect(cardElement).toHaveTextContent("5");
  });

  it("should not display any string if revealedCards is false", () => {
    render(
      <CardOnTable
        voted={{ id: "1", str: "5", value: 5 }}
        revealedCards={false}
      />
    );
    const cardElement = screen.getByTestId("card-on-table");
    expect(cardElement).toBeEmptyDOMElement();
  });
});
