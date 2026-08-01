import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import Avarage from "./Avarage";

const mockStore = configureStore([]);

describe("Avarage component", () => {
  it("should render the average with a comma as the decimal separator", () => {
    const initialState = {
      game: {
        results: {
          avarage: 4.5,
        },
      },
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <Avarage />
      </Provider>
    );

    const averageElement = screen.getByText("4,5");
    expect(averageElement).toBeInTheDocument();
  });

  it("should render 'Promedio'", () => {
    const initialState = {
      game: {
        results: {
          avarage: 0,
        },
      },
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <Avarage />
      </Provider>
    );

    const labelElement = screen.getByText("Promedio");
    expect(labelElement).toBeInTheDocument();
  });
});
