import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Table from "./Table";
import "@testing-library/jest-dom";

// Configuración del store simulado
const mockStore = configureStore();

const store = mockStore({
  game: {
    state: "no_started",
  },
  user: {
    rolCurrentUser: ["owner"],
  },
});

describe("Table", () => {
  it("should render the section with class m-table", () => {
    render(
      <Provider store={store}>
        <Table roles={["owner"]} />
      </Provider>
    );

    const tableDiv = document.querySelector(".m-table");
    expect(tableDiv).toBeInTheDocument();
  });
});
