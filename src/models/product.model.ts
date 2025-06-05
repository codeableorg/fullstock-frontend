// import { type Category } from "./category.model";

export interface Product {
  id: number;
  title: string;
  imgSrc: string;
  alt: string | null;
  price: number;
  description: string | null;
  categoryId: number;
  // categorySlug: Category["slug"];
  isOnSale: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}
