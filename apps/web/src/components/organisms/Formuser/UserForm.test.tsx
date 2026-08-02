import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import UserForm from "./FormUser";
import { joinRoom } from "../../../services/socket";
import "@testing-library/jest-dom";

jest.mock("../../../services/socket", () => ({
  createRoom: jest.fn(),
  joinRoom: jest.fn(),
  chooseCard: jest.fn(),
  revealCards: jest.fn(),
  resetGame: jest.fn(),
  changePool: jest.fn(),
  changeMode: jest.fn(),
  updateRoles: jest.fn(),
  getCreatedRoomId: jest.fn(() => null),
  socket: { on: jest.fn(), emit: jest.fn(), connect: jest.fn() },
}));

describe("UserForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render the form with correct elements", () => {
    render(
      <MemoryRouter>
        <UserForm toggleModalUserForm={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Tu nombre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continuar/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Jugador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Espectador/i)).toBeInTheDocument();
  });

  test("should handle form input change and radio button selection", async () => {
    render(
      <MemoryRouter>
        <UserForm toggleModalUserForm={() => {}} />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Tu nombre/i) as HTMLInputElement;
    const radioPlayer = screen.getByLabelText(/Jugador/i) as HTMLInputElement;
    const radioViewer = screen.getByLabelText(/Espectador/i) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: "Carlos" } });
    });

    expect(input.value).toBe("Carlos");

    await act(async () => {
      fireEvent.click(radioViewer);
    });

    expect(radioViewer.checked).toBe(true);
    expect(radioPlayer.checked).toBe(false);
  });

  test("should emit joinRoom with the room id and mode on submit", async () => {
    render(
      <MemoryRouter initialEntries={["/game/ABC123"]}>
        <Routes>
          <Route path="/game/:roomId" element={<UserForm toggleModalUserForm={() => {}} />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Tu nombre/i) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: "Carlos" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Espectador/i));
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /Continuar/i }));
    });

    expect(joinRoom).toHaveBeenCalledWith({
      roomId: "ABC123",
      name: "Carlos",
      mode: "viwer",
      isOwner: false,
    });
  });
});
