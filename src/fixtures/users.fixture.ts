import { User } from "@/models/user.model";

export const users: { [email: string]: User } = {
  "diego@mail.com": {
    id: "1",
    email: "diego@mail.com",
    name: "Diego Torres",
    password: "letmein",
  },
};
