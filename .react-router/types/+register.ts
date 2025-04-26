import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/:category": {
    "category": string;
  };
  "/products/:id": {
    "id": string;
  };
  "/cart": {};
  "/cart/add-item": {};
  "/cart/remove-item": {};
  "/checkout": {};
  "/order-confirmation/:orderId": {
    "orderId": string;
  };
  "/login": {};
  "/signup": {};
  "/logout": {};
  "/account": {};
  "/account/profile": {};
  "/account/orders": {};
  "/not-found": {};
};