import { Link } from "react-router";

import { ContainerLoader } from "@/components/ui";
import { useAsync } from "@/hooks/use-async";
import { Category } from "@/models/category.model";
import { getAllCategories } from "@/services/category.service";

export function Categories() {
  const {
    data: categories,
    loading,
    error,
  } = useAsync<Category[]>(getAllCategories);

  if (loading) return <ContainerLoader />;

  if (error) throw error;

  return categories?.map((category) => (
    <Link
      to={category.title.toLowerCase()}
      className="flex-1 flex-basis-0"
      key={category.title}
    >
      <div className="rounded-xl overflow-hidden mb-4">
        <img
          src={category.imgSrc}
          alt={category.alt || `${category.title}`}
          className="w-full aspect-[3/2] md:aspect-[4/5] object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2 group-hover:underline">
          {category.title}
        </h3>
        <p className="text-sm leading-5 text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  ));
}
