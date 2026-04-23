import { useState } from 'react';
import type { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="product-card">
            <img
                src={imageError ? 'https://via.placeholder.com/150' : product.image}
                alt={product.title}
                onError={() => setImageError(true)}
                width={150}
            />

            <h3>{product.title}</h3>

            <p>
                <strong>Price:</strong> $
                {typeof product.price === "number"
                    ? product.price.toFixed(2)
                    : "0.00"}
            </p>

            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>

            <p>
                <strong>Rating:</strong> {product.rating?.rate ?? "N/A"}
            </p>

            <button onClick={() => onAddToCart(product)}>
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;