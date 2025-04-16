import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { loader as categoryLoader } from "./routes/category";
import { loader as homeLoader } from "./routes/home";
import { loader as loginLoader, action as loginAction } from "./routes/login";
import { action as logoutAction } from "./routes/logout";
import { action as rootAction, loader as rootLoader } from "./routes/root";

import { loader as accountLoader } from "./routes/account";

import { loader as orderConfirmationLoader } from "./routes/order-confirmation";

import { loader as orderLoader } from "./routes/account/orders";
import {
  loader as profileLoader,
  action as profileAction,
} from "./routes/account/profile";

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
        loader: orderConfirmationLoader,
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
      },
      {
        path: "/logout",
        action: logoutAction,
      },
      {
        path: "/account",
        loader: accountLoader,
        Component: lazy(() => import("./routes/account")),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          {
            path: "profile",
            loader: profileLoader,
            action: profileAction,
            Component: lazy(() => import("./routes/account/profile")),
          },
          {
            path: "orders",
            loader: orderLoader,
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
