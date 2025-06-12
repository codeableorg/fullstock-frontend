import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import OrderConfirmation from ".";
import type { Route } from "./+types";

// Mock Container component
vi.mock("@/components/ui", () => ({
  Container: vi.fn(({ children }) => (
    <div data-testid="mock-container">{children}</div>
  )),
}));

// Creates minimal test props for OrderConfirmation component
const createTestProps = (orderId = "test-123"): Route.ComponentProps => ({
  loaderData: { orderId },
  params: vi.fn() as any,
  matches: vi.fn() as any,
});

describe("OrderConfirmation", () => {
  describe("Success Messages Display", () => {
    it("should display all success messages correctly", () => {
      // Step 1: Setup - Create test props
      const props = createTestProps();
      // Step 2: Mock
      // Step 3: Call - Render component
      render(<OrderConfirmation {...props} />);
      // Step 4: Verify - Check all success messages
      const expectedMessages = [
        "¡Muchas gracias por tu compra!",
        "Tu orden está en camino",
        "Llegaremos a la puerta de tu domicilio lo antes posible",
      ];
      expectedMessages.forEach((message) => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });

  describe("Order Tracking Information", () => {
    it("should display correct tracking code section", () => {
      // Step 1: Setup - Create test props with a specific order ID
      const testOrderId = "order-456";
      const props = createTestProps(testOrderId);
      // Step 2: Mock
      // Step 3: Call - Render component
      render(<OrderConfirmation {...props} />);
      // Step 4: Verify - Check tracking code section
      const trackingCodeLabel = screen.getByText("Código de seguimiento");
      expect(trackingCodeLabel).toBeInTheDocument();

      const trackingCode = screen.getByText(testOrderId);
      expect(trackingCode).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should render with correct layout structure and classes", () => {
      // Step 1: Setup - Create test props
      const props = createTestProps();
      // Step 2: Mock
      // Step 3: Call - Render component
      render(<OrderConfirmation {...props} />);
      // Step 4: Verify - Check layout structure
      const container = screen.getByTestId("mock-container");
      expect(container).toBeInTheDocument();

      const section = container.parentElement;
      expect(section).toHaveClass(
        "pt-12",
        "pb-12",
        "sm:pt-14",
        "sm:pb-14",
        "lg:pt-16",
        "lg:pb-16"
      );
    });
  });
});
