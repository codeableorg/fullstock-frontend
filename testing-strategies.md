# Testing Strategies

## 1. Component Testing Strategy

### UI Components

Test your reusable UI components in isolation:

```typescript
// Example: src/components/ui/button/button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./button";

describe("Button Component", () => {
  it("renders correctly with different variants", () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary");
  });
});
```

### Route Components with Mock Router

Create a test utility for rendering components with React Router context:

```typescript
// src/test-utils/router-utils.tsx
import { createMemoryRouter, RouterProvider } from "react-router";
import { render } from "@testing-library/react";

export const renderWithRouter = (
  component: React.ReactElement,
  initialEntries = ["/"]
) => {
  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: component,
      },
    ],
    { initialEntries }
  );

  return render(<RouterProvider router={router} />);
};
```

## 2. Route Module Testing Strategy

### Testing Loaders

Test loaders independently from components:

```typescript
// src/routes/product/product.loader.test.ts
import { describe, expect, it, vi } from "vitest";
import { loader } from "./index";
import * as productService from "@/services/product.service";

vi.mock("@/services/product.service");

describe("Product Loader", () => {
  it("returns product data when product exists", async () => {
    const mockProduct = { id: 1, title: "Test Product" };
    vi.mocked(productService.getProductById).mockResolvedValue(mockProduct);

    const result = await loader({
      params: { id: "1" },
      request: new Request("http://localhost/products/1"),
      context: {},
    });

    expect(result.product).toEqual(mockProduct);
  });
});
```

### Testing Actions

Test form actions and server-side logic:

```typescript
// src/routes/cart/add-item/add-item.action.test.ts
import { describe, expect, it, vi } from "vitest";
import { action } from "./index";
import * as cartLib from "@/lib/cart";

vi.mock("@/lib/cart");
vi.mock("@/session.server");

describe("Add Item Action", () => {
  it("adds item to cart and redirects", async () => {
    const formData = new FormData();
    formData.append("productId", "1");
    formData.append("quantity", "2");

    const request = new Request("http://localhost", {
      method: "POST",
      body: formData,
    });

    const result = await action({ request, params: {}, context: {} });

    expect(vi.mocked(cartLib.addToCart)).toHaveBeenCalledWith(
      undefined, // userId
      undefined, // sessionCartId
      1, // productId
      2 // quantity
    );
  });
});
```

## 3. Integration Testing Strategy

### Full Route Testing

Test complete user flows with mocked services:

```typescript
// src/routes/product/product.integration.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, it, expect, vi } from "vitest";

import ProductRoute from "./index";
import * as productService from "@/services/product.service";

vi.mock("@/services/product.service");

// Alternative to `renderWithRouter`
const createTestRouter = (loaderData: any) => {
  return createMemoryRouter(
    [
      {
        path: "/products/:id",
        element: <ProductRoute loaderData={loaderData} />,
      },
    ],
    { initialEntries: ["/products/1"] }
  );
};

describe("Product Route Integration", () => {
  it("displays product and allows adding to cart", async () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      price: 99.99,
      description: "Test description",
    };

    const router = createTestRouter({ product: mockProduct });
    render(<RouterProvider router={router} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();

    const addToCartButton = screen.getByText("Agregar al Carrito");
    await userEvent.click(addToCartButton);

    // Test form submission behavior
  });
});
```

## 4. Session Testing Strategy

Create utilities for testing session-dependent functionality:

```typescript
// src/test-utils/session-utils.ts
export const createMockSession = (data: Partial<SessionData> = {}) => ({
  get: vi.fn((key: string) => data[key as keyof SessionData]),
  set: vi.fn(),
  unset: vi.fn(),
  has: vi.fn((key: string) => key in data),
});

export const createMockRequest = (
  url = "http://localhost",
  options: RequestInit = {},
  sessionData: Partial<SessionData> = {}
) => {
  const request = new Request(url, options);
  // Mock session data somehow - you might need to adjust based on your session implementation
  return request;
};
```

## 5. Service Layer Testing

Test your service functions independently:

```typescript
// src/services/cart.service.test.ts
import { describe, expect, it, vi } from "vitest";
import { addToCart } from "@/lib/cart";
import * as cartRepository from "@/repositories/cart.repository";

vi.mock("@/repositories/cart.repository");

describe("Cart Service", () => {
  it("creates new cart for guest user", async () => {
    vi.mocked(cartRepository.getCart).mockResolvedValue(null);
    vi.mocked(cartRepository.createCart).mockResolvedValue({
      id: 1,
      items: [],
      sessionCartId: "test-session",
    });

    await addToCart(undefined, undefined, 1, 2);

    expect(cartRepository.createCart).toHaveBeenCalled();
  });
});
```

## 6. Mock Strategy

Create mock objects to use on your tests. You can also create functions that create those objects

```typescript
// src/test-utils/mocks.ts
export const mockUser = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  isGuest: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockCart = {
  id: 1,
  items: [],
  sessionCartId: "test-session",
  userId: 1,
};

export const mockProduct = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  description: "Test description",
  imgSrc: "/test.jpg",
  features: ["Feature 1"],
  alt: "Test alt",
  categoryId: 1,
  isOnSale: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```
