import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateGameForm from "./CreateGameForm";
import { createRoom } from "../../../services/socket";
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
  socket: { on: jest.fn(), emit: jest.fn(), connect: jest.fn() },
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CreateGameForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render the form with correct elements", () => {
    render(
      <MemoryRouter>
        <CreateGameForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nombra la partida/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Crear partida/i })
    ).toBeInTheDocument();
  });

  test("should handle form input change", async () => {
    render(
      <MemoryRouter>
        <CreateGameForm />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Nombra la partida/i) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: "Nueva Partida" } });
    });

    expect(input.value).toBe("Nueva Partida");
  });

  test("should create room and navigate on form submit", async () => {
    (createRoom as jest.Mock).mockResolvedValue({
      ok: true,
      roomId: "ABC123",
      name: "NuevaPartida",
    });

    render(
      <MemoryRouter>
        <CreateGameForm />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Nombra la partida/i) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: "NuevaPartida" } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /Crear partida/i }));
    });

    expect(createRoom).toHaveBeenCalledWith("NuevaPartida");
    expect(mockNavigate).toHaveBeenCalledWith("/game/ABC123");
  });

  test("should show error message when room creation fails", async () => {
    (createRoom as jest.Mock).mockResolvedValue({
      ok: false,
      error: "Nombre inválido",
    });

    render(
      <MemoryRouter>
        <CreateGameForm />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Nombra la partida/i) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: "NuevaPartida" } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /Crear partida/i }));
    });

    expect(screen.getByText("Nombre inválido")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
