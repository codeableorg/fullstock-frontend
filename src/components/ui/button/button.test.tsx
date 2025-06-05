import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

import { Button } from "@/components/ui";

describe("Button Component", () => {
  it("render correctly", () => {
    render(<Button>Click me</Button>);

    const button = screen.queryByRole("button", {
      name: /click me/i,
    });

    expect(button).toBeInTheDocument();
  });
});
