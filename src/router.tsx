import { createBrowserRouter } from "react-router";

import Cart from "./routes/cart";
import Category from "./routes/category";
import Checkout from "./routes/checkout";
import Home from "./routes/home";
import OrderConfirmation from "./routes/order-confirmation";
import Product from "./routes/product";
import Root from "./routes/root";
import Login from "./routes/login";
import Signup from "./routes/signup";

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
    ],
  },
]);

export default router;
