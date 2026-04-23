import type { Product } from "../types/product";

const BASE_URL = "https://api.escuelajs.co/api/v1";

interface PlatziCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface PlatziProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: PlatziCategory;
}

const mapPlatziProductToProduct = (product: PlatziProduct): Product => {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category.name,
    image:
      product.images && product.images.length > 0
        ? product.images[0]
        : "https://via.placeholder.com/150?text=No+Image",
    rating: {
      rate: 0,
      count: 0,
    },
  };
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: PlatziProduct[] = await response.json();
  return data.map(mapPlatziProductToProduct);
};

export const fetchCategories = async (): Promise<PlatziCategory[]> => {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const fetchProductsByCategory = async (
  categoryId: number
): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/categories/${categoryId}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  const data: PlatziProduct[] = await response.json();
  return data.map(mapPlatziProductToProduct);
};