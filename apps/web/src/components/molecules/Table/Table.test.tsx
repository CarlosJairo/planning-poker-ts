import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Table from "./Table";
import { revealCards, resetGame } from "../../../services/socket";
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

const mockStore = configureStore();

const renderTable = (state: string, roles: string[]) => {
  const store = mockStore({
    game: { state },
    user: { rolCurrentUser: roles },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <Table roles={roles} />
      </Provider>
    ),
  };
};

describe("Table", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the section with class m-table", () => {
    renderTable("no_started", ["owner"]);
    const tableDiv = document.querySelector(".m-table");
    expect(tableDiv).toBeInTheDocument();
  });

  it("should emit revealCards when the owner reveals cards", async () => {
    (revealCards as jest.Mock).mockResolvedValue({ ok: true });
    renderTable("ready_to_show_cards", ["owner"]);

    const button = screen.getByRole("button", { name: /revelar cartas/i });
    fireEvent.click(button);

    expect(revealCards).toHaveBeenCalled();
  });

  it("should emit resetGame when the owner starts a new round", () => {
    (resetGame as jest.Mock).mockResolvedValue({ ok: true });
    renderTable("revealed_cards", ["owner"]);

    const button = screen.getByRole("button", { name: /nueva votación/i });
    fireEvent.click(button);

    expect(resetGame).toHaveBeenCalled();
  });

  it("should not render action buttons for non-owners", () => {
    renderTable("ready_to_show_cards", ["player"]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
