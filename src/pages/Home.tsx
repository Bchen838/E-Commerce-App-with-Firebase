import { useState, useEffect, useMemo } from "react";
import { getAllProducts } from "../firebase/productService";
import ProductCard from "../components/ProductCard";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../cart/cartSlice";
import type { Product } from "../types/product";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setError("");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    return Array.from(uniqueCategories);
  }, [products]);

  const filteredProducts = selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory);


  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Something went wrong while loading data: {error}</p>
  }
  

  return (
    <div>
      <h1>Product Catalog</h1>

      <select
        value={selectedCategory}
        onChange={(e) => 
          setSelectedCategory(e.target.value)
        }
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>


      <div>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default Home;