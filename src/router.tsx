import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { loaderHome } from "./routes/home";
import { action as actionSubscripcion } from "./routes/root";

import { action as loginAction } from "./routes/login";
import { loader as productLoader } from "./routes/product";

const router = createBrowserRouter([
  {
    Component: lazy(() => import("./routes/root")),
    action: actionSubscripcion,
    children: [
      {
        index: true,
        loader: loaderHome,
        Component: lazy(() => import("./routes/home")),
      },
      {
        path: "/:category",
        Component: lazy(() => import("./routes/category")),
      },
      {
        path: "/products/:id",
        Component: lazy(() => import("./routes/product")),
        loader: productLoader,
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
        action: loginAction,
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
