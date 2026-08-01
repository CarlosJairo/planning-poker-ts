import { render, screen } from "@testing-library/react";
import CardResult from "./CardResult";
import "@testing-library/jest-dom";

jest.mock("../../atoms/CardOnTable/CardOnTable", () => (props: { [key: string]: unknown }) => (
  <div data-testid="card-on-table">{JSON.stringify(props)}</div>
));

describe("CardResult", () => {
  const card = {
    id: "1",
    str: "Card A",
    value: 5,
    votes: 3,
  };

  test("should render CardOnTable with correct props", () => {
    render(<CardResult card={card} />);

    const cardOnTable = screen.getByTestId("card-on-table");
    expect(cardOnTable).toBeInTheDocument();
    expect(cardOnTable).toHaveTextContent(
      JSON.stringify({
        voted: card,
        revealedCards: true,
      })
    );
  });

  test("should display 'voto' when votes are 1", () => {
    const singleVoteCard = { ...card, votes: 1 };
    render(<CardResult card={singleVoteCard} />);

    const votesText = screen.getByText(/1 voto/i);
    expect(votesText).toBeInTheDocument();
  });
});
