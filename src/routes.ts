import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  {
    file: "./routes/root/index.tsx",
    children: [
      index("./routes/home/index.tsx"),
      route("/:category", "./routes/category/index.tsx"),
      route("/products/:id", "./routes/product/index.tsx"),
      route("/cart", "./routes/cart/index.tsx"),
      {
        path: "/cart/add-item",
        file: "./routes/cart/add-item/index.tsx",
      },
      {
        path: "/cart/remove-item",
        file: "./routes/cart/remove-item/index.tsx",
      },
      route("/checkout", "./routes/checkout/index.tsx"),
      route(
        "/order-confirmation/:orderId",
        "./routes/order-confirmation/index.tsx"
      ),
      route("/login", "./routes/login/index.tsx"),
      route("/signup", "./routes/signup/index.tsx"),
      {
        path: "/logout",
        file: "./routes/logout/index.tsx",
      },
      route("account", "./routes/account/index.tsx", [
        route("profile", "./routes/account/profile/index.tsx"),
        route("orders", "./routes/account/orders/index.tsx"),
      ]),
      {
        path: "/not-found",
        file: "./routes/not-found/index.tsx",
      },
    ],
  },
] satisfies RouteConfig;
