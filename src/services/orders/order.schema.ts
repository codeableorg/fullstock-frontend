import { z } from "zod";

export const orderSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(2, "Country is required"),
  region: z.string().min(1, "Region is required"),
  zip: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(1, "Phone is required"),
});

export type OrderSchema = z.infer<typeof orderSchema>;
