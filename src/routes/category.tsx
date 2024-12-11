import { useParams } from "react-router";

export default function Category() {
  const { category } = useParams();

  return (
    <div>
      <h1>Category: {category}</h1>
    </div>
  );
}
