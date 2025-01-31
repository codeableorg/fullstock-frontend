import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import { AuthProvider } from "./providers/auth";
import { CartProvider } from "./providers/cart";
import { ThemeProvider } from "./providers/theme";
import router from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="fullstock-ui-theme">
      <CartProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>
);
