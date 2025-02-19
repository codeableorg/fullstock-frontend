import { Category } from "./category.model";

export interface Product {
  id: number;
  title: string;
  imgSrc: string;
  alt?: string;
  price: number;
  description?: string;
  categorySlug: Category["slug"];
  isOnSale: boolean;
  features: string[];
}
