import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import TableAndPlayers from "./TableAndPlayers";
import "@testing-library/jest-dom";

const mockStore = configureMockStore();
const store = mockStore({
  game: {
    state: "started",
    players: [
      { id: "1", name: "Player 1", voted: false, roles: ["player"] },
      {
        id: "2",
        name: "Player 2",
        voted: { id: "2", str: "5", value: 5 },
        roles: ["player"],
      },
    ],
  },
  user: {
    id: "3",
    name: "Current User",
    voted: false,
    rolCurrentUser: ["viwer"],
  },
});

describe("TableAndPlayers", () => {
  test("should render TableAndPlayers and display element with class .o-table-and-players", () => {
    render(
      <Provider store={store}>
        <TableAndPlayers />
      </Provider>
    );

    const sectionElement = document.querySelector(".o-table-and-players");
    expect(sectionElement).toBeInTheDocument();
  });

  test("sin overflow cuando hay 7 o menos jugadores", () => {
    const players = Array.from({ length: 7 }, (_, i) => ({
      id: `p${i}`,
      name: `Player ${i}`,
      voted: false,
      roles: ["player"],
    }));
    const smallStore = mockStore({
      game: { state: "started", players },
      user: {
        id: "me",
        name: "Current",
        voted: false,
        rolCurrentUser: ["owner"],
      },
    });

    render(
      <Provider store={smallStore}>
        <TableAndPlayers />
      </Provider>
    );

    expect(document.querySelector(".overflow-players")).toBeNull();
    expect(document.querySelectorAll(".m-user-item")).toHaveLength(7);
  });

  test("renderiza la franja de overflow cuando hay más de 7 jugadores", () => {
    const players = Array.from({ length: 9 }, (_, i) => ({
      id: `p${i}`,
      name: `Player ${i}`,
      voted: false,
      roles: ["player"],
    }));
    const bigStore = mockStore({
      game: { state: "started", players },
      user: {
        id: "me",
        name: "Current",
        voted: false,
        rolCurrentUser: ["owner"],
      },
    });

    render(
      <Provider store={bigStore}>
        <TableAndPlayers />
      </Provider>
    );

    const overflow = document.querySelector(".overflow-players");
    expect(overflow).toBeInTheDocument();
    expect(overflow?.querySelectorAll(".m-user-item")).toHaveLength(2);
    expect(document.querySelectorAll(".m-user-item")).toHaveLength(9);
  });

  test("al cambiar a espectador, los demás ven su logo en lugar de su carta", () => {
    const playerStore = mockStore({
      game: {
        state: "started",
        players: [{ id: "1", name: "Sara", voted: false, roles: ["player"] }],
      },
      user: {
        id: "me",
        name: "Current",
        voted: false,
        rolCurrentUser: ["owner"],
      },
    });

    const { rerender } = render(
      <Provider store={playerStore}>
        <TableAndPlayers />
      </Provider>
    );

    expect(
      screen.getByText("Sara").closest(".m-user-item")?.querySelector(
        "[data-testid='card-on-table']"
      )
    ).toBeInTheDocument();

    const viewerStore = mockStore({
      game: {
        state: "started",
        players: [{ id: "1", name: "Sara", voted: false, roles: ["viwer"] }],
      },
      user: {
        id: "me",
        name: "Current",
        voted: false,
        rolCurrentUser: ["owner"],
      },
    });

    rerender(
      <Provider store={viewerStore}>
        <TableAndPlayers />
      </Provider>
    );

    const userItem = screen.getByText("Sara").closest(".m-user-item");
    expect(userItem?.querySelector("[data-testid='card-on-table']")).toBeNull();
    expect(userItem?.querySelector(".a-user-logo")?.textContent).toBe("S");
  });
});
