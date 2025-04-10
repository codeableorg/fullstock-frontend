import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { loader as categoryLoader, action as categoryAction } from "./routes/category";

const router = createBrowserRouter([
  {
    Component: lazy(() => import("./routes/root")),
    children: [
      {
        index: true,
        Component: lazy(() => import("./routes/home")),
      },
      {
        path: "/:category",
        Component: lazy(() => import("./routes/category")),
        loader: categoryLoader,
        action: categoryAction,
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
        path: "*",
        Component: lazy(() => import("./routes/not-found")),
      },
    ],
  },
]);

export default router;
