import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import toastReducer, {
  showToast,
  clearToast,
} from "../../../reducers/toast/toastSlice";
import Toast from "./Toast";
import "@testing-library/jest-dom";

const createStore = () =>
  configureStore({ reducer: { toast: toastReducer } });

describe("Toast", () => {
  test("renders the message and auto-dismisses after the duration", () => {
    jest.useFakeTimers();
    const store = createStore();

    render(
      <Provider store={store}>
        <Toast />
      </Provider>
    );

    act(() => {
      store.dispatch(showToast({ message: "Te fijaron como administrador" }));
    });

    expect(
      screen.getByText("Te fijaron como administrador")
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3600);
    });

    expect(
      screen.queryByText("Te fijaron como administrador")
    ).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  test("applies the info variant class", () => {
    jest.useFakeTimers();
    const store = createStore();

    render(
      <Provider store={store}>
        <Toast />
      </Provider>
    );

    act(() => {
      store.dispatch(
        showToast({ message: "Cambiaste a espectador", variant: "info" })
      );
    });

    const toast = screen.getByText("Cambiaste a espectador").closest("div");
    expect(toast).toHaveClass("m-toast--info");

    act(() => {
      jest.advanceTimersByTime(3600);
      store.dispatch(clearToast());
    });

    jest.useRealTimers();
  });
});
