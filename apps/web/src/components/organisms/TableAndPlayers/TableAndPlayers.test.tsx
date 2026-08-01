import { render } from "@testing-library/react";
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
});
