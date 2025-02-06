import { Category } from "./category.model";

export interface Product {
  id: string;
  title: string;
  imgSrc: string;
  price: number;
  description: string;
  categorySlug: Category["slug"];
  isOnSale: boolean;
  features: string[];
}
