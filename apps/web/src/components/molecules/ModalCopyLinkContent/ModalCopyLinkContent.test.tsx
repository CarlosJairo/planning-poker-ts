import { copyToClipboard } from "./ModalCopyLinkContent";
describe("copyToClipboard function", () => {
  // Mock para console.error para evitar errores en la consola
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // Configurar el mock para navigator.clipboard.writeText
  beforeAll(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    // Restablecer el mock antes de cada prueba
    (navigator.clipboard.writeText as jest.Mock).mockReset();
  });

  test("should copy text to clipboard and return true", async () => {
    // Mock exitoso
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    const result = await copyToClipboard("test text");

    // Verificar que la función writeText fue llamada con el texto correcto
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
    // Verificar que la función devuelve true
    expect(result).toBe(true);
  });

  test("should return false if copying text to clipboard fails", async () => {
    // Mock fallido
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
      new Error("Copy failed")
    );

    const result = await copyToClipboard("test text");

    // Verificar que la función writeText fue llamada con el texto correcto
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
    // Verificar que la función devuelve false
    expect(result).toBe(false);
  });
});
