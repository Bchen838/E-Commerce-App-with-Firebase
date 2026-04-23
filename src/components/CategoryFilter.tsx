interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | "all";
  onCategoryChange: (category: number | "all") => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => {
        const value = e.target.value;
        onCategoryChange(value === "all" ? "all" : Number(value));
      }}
    >
      <option value="all">All Categories</option>

      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;