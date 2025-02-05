import { createBrowserRouter, Navigate } from "react-router";

import Cart from "./routes/cart";
import Category from "./routes/category";
import Checkout from "./routes/checkout";
import Home from "./routes/home";
import OrderConfirmation from "./routes/order-confirmation";
import Product from "./routes/product";
import Root from "./routes/root";
import Login from "./routes/login";
import Signup from "./routes/signup";
import Account from "./routes/account";
import Profile from "./routes/account/profile";
import Orders from "./routes/account/orders";

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/:category",
        element: <Category />,
      },
      {
        path: "/products/:id",
        element: <Product />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/order-confirmation/:orderId",
        element: <OrderConfirmation />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/account",
        element: <Account />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <Profile /> },
          { path: "orders", element: <Orders /> },
        ],
      },
    ],
  },
]);

export default router;
