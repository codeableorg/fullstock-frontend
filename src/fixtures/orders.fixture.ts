import { Order } from "@/models/order.model";
import { products } from "./products.fixture";
import { users } from "./users.fixture";

export const orders: Order[] = [
  {
    id: "a9dfc53f-8ac7-4399-89a5-6a365ebde1ec",
    userId: users[0].id,
    items: [
      {
        product: products[0],
        quantity: 1,
      },
      {
        product: products[1],
        quantity: 2,
      },
    ],
    details: {
      email: users[0].email,
      firstName: "Diego",
      lastName: "Torres",
      company: "",
      address: "Av. Las Calles 123",
      city: "Lima",
      country: "PE",
      region: "Lima",
      zip: "15048",
      phone: "987654321",
    },
    createdAt: new Date("2025-02-04T16:50:34.365Z"),
  },
];
