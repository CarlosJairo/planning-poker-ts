import { render, act } from "@testing-library/react";
import SplashScreen from "./SplashScreen";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom";

describe("SplashScreen", () => {
  test("should render SplashScreen and display elements", () => {
    const setShowSplashScreen = jest.fn();
    const { container } = render(
      <SplashScreen
        showSplashScreen={true}
        setShowSplashScreen={setShowSplashScreen}
      />
    );

    // Verifica que los elementos esperados están en el DOM
    expect(container.querySelector(".logo-screen")).toBeInTheDocument();
  });

  test("should call setShowSplashScreen with false after 2 seconds", () => {
    jest.useFakeTimers();
    const setShowSplashScreen = jest.fn();

    render(
      <SplashScreen
        showSplashScreen={true}
        setShowSplashScreen={setShowSplashScreen}
      />
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verifica que la función setShowSplashScreen se ha llamado con false
    expect(setShowSplashScreen).toHaveBeenCalledWith(false);

    // Limpia los temporizadores
    jest.useRealTimers();
  });
});
