import { createBrowserRouter } from "react-router";
import Root from "./routes/root";
import Home from "./routes/home";
import Category from "./routes/category";
import Product from "./routes/product";
import Cart from "./routes/cart";
import Checkout from "./routes/checkout";
import OrderConfirmation from "./routes/order-confirmation";

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
    ],
  },
]);

export default router;
