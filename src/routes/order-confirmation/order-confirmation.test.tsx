import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrderConfirmation from ".";

import type { Route } from "./+types";

// Creates minimal test props for OrderConfirmation component
const createTestProps = (orderId = "test-123"): Route.ComponentProps => ({
  loaderData: { orderId },
  params: { orderId },
  // Hack to satisfy type requirements
  matches: [] as unknown as Route.ComponentProps["matches"],
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
        expect(screen.queryByText(message)).toBeInTheDocument();
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
      const trackingCodeLabel = screen.queryByText("Código de seguimiento");
      expect(trackingCodeLabel).toBeInTheDocument();

      const trackingCode = screen.queryByText(testOrderId);
      expect(trackingCode).toBeInTheDocument();
    });
  });
});
