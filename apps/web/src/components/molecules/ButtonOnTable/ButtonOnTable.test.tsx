import { render, screen, fireEvent } from "@testing-library/react";
import ButtonOnTable from "./ButtonOnTable";
import "@testing-library/jest-dom";

describe("ButtonOnTable", () => {
  const mockShowCards = jest.fn();
  const mockRestartGame = jest.fn();

  test("should not render anything if loading is true", () => {
    render(
      <ButtonOnTable
        state="ready_to_show_cards"
        isOwner={true}
        loading={true}
        showCards={mockShowCards}
        restartGame={mockRestartGame}
      />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("should not render anything if user is not the owner", () => {
    render(
      <ButtonOnTable
        state="ready_to_show_cards"
        isOwner={false}
        loading={false}
        showCards={mockShowCards}
        restartGame={mockRestartGame}
      />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test('should render "Revelar cartas" button if state is "ready_to_show_cards" and user is owner', () => {
    render(
      <ButtonOnTable
        state="ready_to_show_cards"
        isOwner={true}
        loading={false}
        showCards={mockShowCards}
        restartGame={mockRestartGame}
      />
    );
    const button = screen.getByRole("button", { name: /revelar cartas/i });
    expect(button).toBeInTheDocument();

    // Simula un clic en el botón
    fireEvent.click(button);
    expect(mockShowCards).toHaveBeenCalled();
  });
});
