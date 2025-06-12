import { describe, expect, it } from "vitest";

import { loader } from ".";

describe("OrderConfirmation loader", () => {
  // Helper function to create loader arguments
  const createLoaderArgs = (orderId: string) => ({
    params: { orderId },
    request: new Request(`http://localhost/order-confirmation/${orderId}`),
    context: {},
  });

  it("should return orderId from params", async () => {
    // Step 1: Setup - Create test data
    const testOrderId = "testOrderId-123"; // Example order ID

    // Step 2: Mock - Not needed as loader has no dependencies

    // Step 3: Call service function
    const result = await loader(createLoaderArgs(testOrderId));

    // Step 4: Verify expected behavior
    expect(result).toEqual({
      orderId: testOrderId,
    });
  });
});
