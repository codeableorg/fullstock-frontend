import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { action as loginAction } from "./routes/login";
import { loader as productLoader } from "./routes/product";

import { loader as categoryLoader } from "./routes/category";
import {
  action as checkoutAction,
  loader as checkoutLoader,
} from "./routes/checkout";
import { loader as homeLoader } from "./routes/home";
import { loader as loginLoader, action as loginAction } from "./routes/login";
import { action as logoutAction } from "./routes/logout";
import { action as rootAction, loader as rootLoader } from "./routes/root";
import { action as signupAction } from "./routes/signup";

const router = createBrowserRouter([
  {
    Component: lazy(() => import("./routes/root")),
    action: rootAction,
    loader: rootLoader,
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
        loader: productLoader,
      },
      {
        path: "/cart",
        Component: lazy(() => import("./routes/cart")),
      },
      {
        path: "/checkout",
        Component: lazy(() => import("./routes/checkout")),
        loader: checkoutLoader,
        action: checkoutAction,
      },
      {
        path: "/order-confirmation/:orderId",
        Component: lazy(() => import("./routes/order-confirmation")),
      },
      {
        path: "/login",
        Component: lazy(() => import("./routes/login")),
        action: loginAction,
        loader: loginLoader,
      },
      {
        path: "/signup",
        Component: lazy(() => import("./routes/signup")),
        action: signupAction,
      },
      {
        path: "/logout",
        action: logoutAction,
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
