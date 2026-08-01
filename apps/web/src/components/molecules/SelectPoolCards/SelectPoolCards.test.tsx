import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import SelectPoolCards from "./SelectPoolCards";
import { changePool } from "../../../services/socket";

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

describe("SelectPoolCards", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      game: {
        allPoolCards: {
          fibonacci: [{ id: "1", str: "1", value: 1 }],
          modifiedFibonacci: [{ id: "2", str: "2", value: 2 }],
        },
        poolKey: "fibonacci",
        state: "started",
        selectedCards: [],
      },
      user: {
        rolCurrentUser: ["owner"],
      },
    });
  });

  it("should render select element when user is owner and no cards are selected", () => {
    render(
      <Provider store={store}>
        <SelectPoolCards />
      </Provider>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should emit changePool when selection changes", () => {
    render(
      <Provider store={store}>
        <SelectPoolCards />
      </Provider>
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "modifiedFibonacci" },
    });

    expect(changePool).toHaveBeenCalledWith("modifiedFibonacci");
  });

  it("should not render select element if user is not owner", () => {
    store = mockStore({
      game: {
        allPoolCards: {
          fibonacci: [{ id: "1", str: "1", value: 1 }],
          modifiedFibonacci: [{ id: "2", str: "2", value: 2 }],
        },
        poolKey: "fibonacci",
        state: "started",
        selectedCards: [],
      },
      user: {
        rolCurrentUser: ["player"],
      },
    });

    render(
      <Provider store={store}>
        <SelectPoolCards />
      </Provider>
    );

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
