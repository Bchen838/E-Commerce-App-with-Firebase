import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "../components/ProductCard";

describe("ProductCard Component", () => {
  const mockProduct = {
    id: "1",
    title: "Wireless Headphones",
    price: 199.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation.",
    image: "https://t-mobile.scene7.com/is/image/Tmusprod/Apple-iPhone-17-Pro-4x3-1:4x3?ts=1775062736418&dpr=on",
    rating: {
      rate: 4.5,
      count: 120,
    },
  };

  test("renders product information correctly", () => {
    const mockAddToCart = jest.fn();

    render(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    );

    expect(
      screen.getByRole("heading", { name: "Wireless Headphones" })
    ).toBeInTheDocument();

    expect(screen.getByText(/\$199.99/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(
      screen.getByText(/High-quality wireless headphones with noise cancellation./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/4.5/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Wireless Headphones/i)).toBeInTheDocument();
  });

  test("calls onAddToCart when the button is clicked", () => {
    const mockAddToCart = jest.fn();

    render(
      <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add to Cart/i }));

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});