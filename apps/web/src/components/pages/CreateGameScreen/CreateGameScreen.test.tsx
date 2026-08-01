import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import CreateGameScreen from "./CreateGameScreen";
import "@testing-library/jest-dom";

// Configura el mock store sin thunk
const mockStore = configureMockStore();
const store = mockStore({});

// Mock de HeaderHome y CreateGameForm
jest.mock("../../organisms/HeaderHome/HeaderHome", () => () => (
  <div>HeaderHome Mock</div>
));
jest.mock("../../organisms/CreateGameForm/CreateGameForm", () => () => (
  <div>CreateGameForm Mock</div>
));

describe("CreateGameScreen", () => {
  test("should render the element with class 'create-game-screen'", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateGameScreen />
        </MemoryRouter>
      </Provider>
    );

    // Verifica que el elemento con la clase 'create-game-screen' está presente
    const element = document.querySelector(".create-game-screen");
    expect(element).toBeInTheDocument();
  });
});
