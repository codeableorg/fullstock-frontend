import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Button } from "@/components/ui";

describe("Button Component", () => {
  it("render correctly", () => {
    render(<Button>Click me</Button>);

    const button = screen.queryByRole("button", {
      name: /click me/i,
    });

    expect(button).toBeInTheDocument();
  });

  it("render secondary variant correctly", () => {
    render(<Button variant="secondary">Click me</Button>);

    const button = screen.queryByRole("button", {
      name: /click me/i,
    });

    expect(button).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
      "hover:bg-secondary-hover"
    );
  });
});
