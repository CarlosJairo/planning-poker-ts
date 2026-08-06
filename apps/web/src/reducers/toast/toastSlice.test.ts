import toastReducer, { showToast, clearToast } from "./toastSlice";

describe("toastSlice", () => {
  test("showToast sets the message and default variant", () => {
    const state = toastReducer(null, showToast({ message: "Hola" }));
    expect(state?.message).toBe("Hola");
    expect(state?.variant).toBe("success");
    expect(state?.id).toBeGreaterThan(0);
  });

  test("showToast keeps the provided variant", () => {
    const state = toastReducer(
      null,
      showToast({ message: "Cambiaste", variant: "info" })
    );
    expect(state?.variant).toBe("info");
  });

  test("clearToast resets the state to null", () => {
    const withToast = toastReducer(null, showToast({ message: "Hola" }));
    expect(toastReducer(withToast, clearToast())).toBeNull();
  });
});
