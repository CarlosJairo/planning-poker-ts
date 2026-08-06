import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import CurrentUserItem from "./CurrentUserItem";
import "@testing-library/jest-dom";
import { store } from "../../../app/store";

describe("CurrentUserItem", () => {
  const user = {
    id: "1",
    name: "John Doe",
    voted: { id: "card1", str: "Card A", value: 5 },
    rolCurrentUser: ["viwer"],
  };

  test("should render UserLogo when user is a viwer", () => {
    render(
      <Provider store={store}>
        <CurrentUserItem user={user} />
      </Provider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("John Doe").closest("div")).toHaveClass(
      "m-current-user"
    );
    expect(screen.getByText("John Doe").previousSibling).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute(
      "title",
      "Cambiar a jugador"
    );
  });

  test("should render the button when user is an owner", () => {
    render(
      <Provider store={store}>
        <CurrentUserItem user={{ ...user, rolCurrentUser: ["owner"] }} />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("");
    expect(button).toHaveAttribute("title", "Cambiar a espectador");
    expect(button.querySelector("svg")).toBeInTheDocument(); // Verifica que el icono está presente
  });

  test("owner spectator renders UserLogo and can toggle back to player", () => {
    render(
      <Provider store={store}>
        <CurrentUserItem
          user={{ ...user, rolCurrentUser: ["viwer", "owner"] }}
        />
      </Provider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("John Doe").closest("div")).toHaveClass(
      "m-current-user"
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "title",
      "Cambiar a jugador"
    );
  });
});
