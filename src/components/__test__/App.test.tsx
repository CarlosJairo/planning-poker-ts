import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Louder from "../atoms/Louder/Louder";

test("demo", () => {
  expect(true).toBe(true);
});

test("renders the main page", () => {
  render(<Louder />);
  expect(true).toBeTruthy();
});
