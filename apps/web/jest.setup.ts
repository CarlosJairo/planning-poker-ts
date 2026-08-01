import "@testing-library/jest-dom";

jest.mock("socket.io-client", () => {
  const mockSocket = {
    id: "test-socket-id",
    connected: false,
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
  return { io: jest.fn(() => mockSocket) };
});
