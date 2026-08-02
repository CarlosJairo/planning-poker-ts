import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import GameTableScreen from "./GameTableScreen";
import { getJoin, clearJoin } from "../../../services/socket";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ roomId: "ABC123" }),
}));

const mockJoinRoom = jest.fn();
jest.mock("../../../services/socket", () => ({
  getJoin: jest.fn(() => null),
  clearJoin: jest.fn(),
  joinRoom: (...args: unknown[]) => mockJoinRoom(...args),
}));

// Configura el mock store sin thunk
const mockStore = configureMockStore();
const store = mockStore({
  game: {
    poolCards: [{ id: "1", str: "A", value: 1 }],
    state: "revealed_cards",
    players: [
      { id: "1", name: "Laura", roles: ["viwer"], voted: false },
      {
        id: "3",
        name: "Carlos",
        roles: ["player"],
        voted: { id: "3", str: "5", value: 5 },
      },
      {
        id: "100",
        name: "User 1",
        voted: false,
        roles: ["owner"],
      },
    ],
    results: { count: [{ id: "3", str: "5", value: 5 }], avarage: 5 },
  },
  user: {
    id: "100",
    name: "User 1",
    voted: false,
    rolCurrentUser: ["owner"],
  },
});

// Mocks para useModal
const mockToggleModalUserForm = jest.fn();
jest.mock("../../../hooks/useModal", () => () => [
  false,
  mockToggleModalUserForm,
]);

describe("GameTableScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the components correctly", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameTableScreen />
        </MemoryRouter>
      </Provider>
    );

    // Verifica que el componente GameTableScreen se renderiza
    const tableAndPlayers = document.querySelector(".game-table-screen");

    expect(tableAndPlayers).toBeInTheDocument();
  });

  test("auto-rejoins a stored session after a refresh", async () => {
    mockJoinRoom.mockResolvedValue({ ok: true });
    (getJoin as jest.Mock).mockReturnValueOnce({
      roomId: "ABC123",
      name: "CarlosAdmin",
      mode: "player",
      isOwner: true,
    });
    const freshStore = mockStore({
      game: {
        poolCards: [{ id: "1", str: "A", value: 1 }],
        state: "revealed_cards",
        players: [],
        results: { count: [], avarage: 0 },
      },
      user: { id: "", name: "", voted: false, rolCurrentUser: [] },
    });

    render(
      <Provider store={freshStore}>
        <MemoryRouter>
          <GameTableScreen />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockJoinRoom).toHaveBeenCalledWith({
        roomId: "ABC123",
        name: "CarlosAdmin",
        mode: "player",
        isOwner: true,
      });
    });
  });

  test("clears the stored session when the rejoin fails", async () => {
    mockJoinRoom.mockResolvedValueOnce({ ok: false, error: "La sala no existe" });
    (getJoin as jest.Mock).mockReturnValueOnce({
      roomId: "ABC123",
      name: "CarlosAdmin",
      mode: "player",
    });
    const freshStore = mockStore({
      game: {
        poolCards: [{ id: "1", str: "A", value: 1 }],
        state: "revealed_cards",
        players: [],
        results: { count: [], avarage: 0 },
      },
      user: { id: "", name: "", voted: false, rolCurrentUser: [] },
    });

    render(
      <Provider store={freshStore}>
        <MemoryRouter>
          <GameTableScreen />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(clearJoin).toHaveBeenCalled();
    });
  });
});
