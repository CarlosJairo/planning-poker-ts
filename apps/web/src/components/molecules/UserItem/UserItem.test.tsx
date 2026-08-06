import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserItem from "./UserItem";
import "@testing-library/jest-dom";

const mockStore = configureMockStore();
const store = mockStore({
  game: { state: "started" },
  user: { rolCurrentUser: ["owner"] },
});

describe("UserItem", () => {
  const userViewer = {
    id: "1",
    name: "John Doe",
    voted: false,
    roles: ["viwer"],
  };

  const userNotOwner = {
    id: "3",
    name: "Alice Doe",
    voted: false,
    roles: [],
  };

  test("should render UserLogo when user is a viewer", () => {
    render(
      <Provider store={store}>
        <UserItem user={userViewer} />
      </Provider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("John Doe").closest("div")).toHaveClass(
      "m-user-item"
    );
  });

  test("should render Button with UserPlus icon if current user is owner and user is not owner", () => {
    render(
      <Provider store={store}>
        <UserItem user={userNotOwner} />
      </Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Fijar como admin");
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("Alice Doe")).toBeInTheDocument();
  });
});
