import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import SelectableCardContainer from "./SelectableCardContainer";
import { chooseCard } from "../../../services/socket";
import "@testing-library/jest-dom";

jest.mock("../../../services/socket", () => ({
  createRoom: jest.fn(),
  joinRoom: jest.fn(),
  chooseCard: jest.fn(),
  revealCards: jest.fn(),
  resetGame: jest.fn(),
  changePool: jest.fn(),
  changeMode: jest.fn(),
  updateRoles: jest.fn(),
  socket: { on: jest.fn(), emit: jest.fn(), connect: jest.fn() },
}));

const mockStore = configureMockStore();

describe("SelectableCardContainer", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      user: {
        rolCurrentUser: ["player"],
        id: "123",
        voted: false,
      },
      game: {
        allPoolCards: { fibonacci: [] },
        poolKey: "fibonacci",
        state: "started",
        selectedCards: [],
      },
    });
  });

  test("should render SelectableCardContainer and display cards", () => {
    const poolCards = [
      { id: "1", str: "1", value: 1 },
      { id: "2", str: "2", value: 2 },
    ];

    render(
      <Provider store={store}>
        <SelectableCardContainer poolCards={poolCards} />
      </Provider>
    );

    expect(screen.getByText(/Elige una carta/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  test("should emit chooseCard when a card is selected", () => {
    const poolCards = [{ id: "1", str: "1", value: 1 }];

    render(
      <Provider store={store}>
        <SelectableCardContainer poolCards={poolCards} />
      </Provider>
    );

    const card = screen.getByText(/1/i);
    fireEvent.click(card);

    expect(chooseCard).toHaveBeenCalledWith("1");
  });

  test("should render 'No hay cartas' message when no cards are available", () => {
    render(
      <Provider store={store}>
        <SelectableCardContainer poolCards={[]} />
      </Provider>
    );

    expect(screen.getByText(/No hay cartas/i)).toBeInTheDocument();
  });
});
