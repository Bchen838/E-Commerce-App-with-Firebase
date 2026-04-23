import { useEffect, useState, type ChangeEvent } from "react";
import { getAllProducts, updateProduct, deleteProduct} from "../firebase/productService";
import { type Product } from "../types/product";

interface DisplayProductsProps {
  refreshKey: number;
}

const DisplayProducts = ({ refreshKey }: DisplayProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editValues, setEditValues] = useState<
    Record<string, { title: string; price: string }>
  >({});
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const data = await getAllProducts();

        if (ignore) return;

        setProducts(data);

        const initialEditValues: Record<
          string,
          { title: string; price: string }
        > = {};

        data.forEach((product) => {
          if (product.id) {
            initialEditValues[product.id] = {
              title: product.title,
              price: product.price.toString(),
            };
          }
        });

        setEditValues(initialEditValues);
        setError("");
      } catch (err: unknown) {
        if (ignore) return;

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch products.");
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const reloadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);

      const initialEditValues: Record<string, { title: string; price: string }> =
        {};

      data.forEach((product) => {
        if (product.id) {
          initialEditValues[product.id] = {
            title: product.title,
            price: product.price.toString(),
          };
        }
      });

      setEditValues(initialEditValues);
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reload products.");
      }
    }
  };

  const handleEditChange = (
    productId: string,
    field: "title" | "price",
    value: string
  ) => {
    setEditValues((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleUpdateTitle = async (productId: string) => {
    try {
      const newTitle = editValues[productId]?.title.trim();

      if (!newTitle) {
        setError("Title cannot be empty.");
        return;
      }

      await updateProduct(productId, { title: newTitle });
      await reloadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update title.");
      }
    }
  };

  const handleUpdatePrice = async (productId: string) => {
    try {
      const rawPrice = editValues[productId]?.price;
      const parsedPrice = Number(rawPrice);

      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        setError("Price must be a valid non-negative number.");
        return;
      }

      await updateProduct(productId, { price: parsedPrice });
      await reloadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update price.");
      }
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await reloadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete product.");
      }
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {products.map((product) => {
        if (!product.id) return null;

        const productId = product.id;

        return (
          <div
            key={productId}
            style={{ border: "2px solid black", margin: "10px", padding: "10px" }}
          >
            <p>Title: {product.title}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Description: {product.description}</p>
            <img src={product.image} alt={product.title} width={100} />

            <input
              type="text"
              placeholder="Enter new title"
              value={editValues[productId]?.title ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleEditChange(productId, "title", e.target.value)
              }
            />
            <button onClick={() => handleUpdateTitle(productId)}>
              Update Title
            </button>

            <input
              type="number"
              placeholder="Enter new price"
              value={editValues[productId]?.price ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleEditChange(productId, "price", e.target.value)
              }
            />
            <button onClick={() => handleUpdatePrice(productId)}>
              Update Price
            </button>

            <button
              style={{ backgroundColor: "crimson" }}
              onClick={() => handleDelete(productId)}
            >
              Delete Product
            </button>
          </div>
        );
      })}

      {error && <p>{error}</p>}
    </div>
  );
};

export default DisplayProducts;