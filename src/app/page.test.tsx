import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the home page placeholder", () => {
    render(<Home />);

    expect(
      screen.getByText("To get started, edit the page.tsx file."),
    ).toBeInTheDocument();
  });
});
