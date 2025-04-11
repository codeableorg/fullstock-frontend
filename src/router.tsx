import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { loader as homeLoader } from "./routes/home";
import { action as rootAction } from "./routes/root";

import { loader as categoryLoader } from "./routes/category";

const router = createBrowserRouter([
  {
    Component: lazy(() => import("./routes/root")),
    action: rootAction,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: lazy(() => import("./routes/home")),
      },
      {
        path: "/:category",
        Component: lazy(() => import("./routes/category")),
        loader: categoryLoader,
        errorElement: <h1>Category not found</h1>,
      },
      {
        path: "/products/:id",
        Component: lazy(() => import("./routes/product")),
      },
      {
        path: "/cart",
        Component: lazy(() => import("./routes/cart")),
      },
      {
        path: "/checkout",
        Component: lazy(() => import("./routes/checkout")),
      },
      {
        path: "/order-confirmation/:orderId",
        Component: lazy(() => import("./routes/order-confirmation")),
      },
      {
        path: "/login",
        Component: lazy(() => import("./routes/login")),
      },
      {
        path: "/signup",
        Component: lazy(() => import("./routes/signup")),
      },
      {
        path: "/account",
        Component: lazy(() => import("./routes/account")),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          {
            path: "profile",
            Component: lazy(() => import("./routes/account/profile")),
          },
          {
            path: "orders",
            Component: lazy(() => import("./routes/account/orders")),
          },
        ],
      },
      {
        path: "/not-found",
        Component: lazy(() => import("./routes/not-found")),
      },
      {
        path: "*",
        Component: lazy(() => import("./routes/not-found")),
      },
    ],
  },
]);

export default router;
