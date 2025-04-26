import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  {
    file: "./routes/root/index.tsx",
    children: [
      index("./routes/home/index.tsx"),
      route("/:category", "./routes/category/index.tsx"),
      route("/products/:id", "./routes/product/index.tsx"),
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
      route("/login", "./routes/login/index.tsx"),
      route("/signup", "./routes/signup/index.tsx"),
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
