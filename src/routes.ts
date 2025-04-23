import type { RouteConfig } from "@react-router/dev/routes";

export default [
  {
    file: "./routes/root/index.tsx",
    children: [
      {
        index: true,
        file: "./routes/home/index.tsx",
      },
      {
        path: "/:category",
        file: "./routes/category/index.tsx",
      },
      {
        path: "/products/:id",
        file: "./routes/product/index.tsx",
      },
      {
        path: "/cart",
        file: "./routes/cart/index.tsx",
      },
      {
        path: "/cart/add-item",
        file: "./routes/cart/add-item/index.tsx",
      },
      {
        path: "/cart/remove-item",
        file: "./routes/cart/remove-item/index.tsx",
      },
      {
        path: "/checkout",
        file: "./routes/checkout/index.tsx",
      },
      {
        path: "/order-confirmation/:orderId",
        file: "./routes/order-confirmation/index.tsx",
      },
      {
        path: "/login",
        file: "./routes/login/index.tsx",
      },
      {
        path: "/signup",
        file: "./routes/signup/index.tsx",
      },
      {
        path: "/logout",
        file: "./routes/logout/index.tsx",
      },
      {
        path: "/account",
        file: "./routes/account/index.tsx",
        children: [
          // { index: true, element: <Navigate to="profile" replace /> },
          {
            path: "profile",
            file: "./routes/account/profile/index.tsx",
          },
          {
            path: "orders",
            file: "./routes/account/orders/index.tsx",
          },
        ],
      },
      {
        path: "/not-found",
        file: "./routes/not-found/index.tsx",
      },
    ],
  },
] satisfies RouteConfig;
