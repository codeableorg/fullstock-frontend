import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import "./index.css";
import Home from "./routes/home";
import Layout from "./routes/layout";
import Category from "./routes/category";
import { ThemeProvider } from "./providers/theme";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/:category",
        element: <Category />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="fullstock-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
