import { useState, type FormEvent, type ChangeEvent } from "react";
import { createProduct } from "../firebase/productService";
import { type Product } from "../types/product";

type NewProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

interface AddProductFormProps {
    onProductAdded: () => void; 
}

const AddProductForm = ({ onProductAdded }: AddProductFormProps) => {
    const [productData, setProductData] = useState<NewProduct>({
        title: "", 
        price: 0, 
        description: "",
        category: "",
        image: "",
        rating: {
            rate: 0,
            count: 0,
        },
    });

    const [error, setError] = useState(""); 

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setProductData((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setProductData((prev) => ({
            ...prev,
            rating: {
                ...prev.rating,
                [name]: Number(value),
            },
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await createProduct(productData);
            setError("");
            alert("Product added successfully!");

            setProductData({
                title: "",
                price: 0,
                description: "",
                category: "",
                image: "",
                rating: {
                    rate: 0,
                    count: 0,
                },
            });

            onProductAdded(); 
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to add product.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="title"
                placeholder="Title"
                value={productData.title}
                onChange={handleChange}
            />
            <input
                name="price"
                type="number"
                placeholder="Price"
                value={productData.price}
                onChange={handleChange}
            />
            <input
                name="description"
                placeholder="Description"
                value={productData.description}
                onChange={handleChange}
            />
            <input
                name="category"
                placeholder="Category"
                value={productData.category}
                onChange={handleChange}
            />
            <input
                name="image"
                placeholder="Image URL"
                value={productData.image}
                onChange={handleChange}
            />
            <input
                name="rate"
                type="number"
                placeholder="Rating"
                value={productData.rating.rate}
                onChange={handleRatingChange}
            />
            <input
                name="count"
                type="number"
                placeholder="Rating Count"
                value={productData.rating.count}
                onChange={handleRatingChange}
            />

            <button type="submit">Add Product</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default AddProductForm;