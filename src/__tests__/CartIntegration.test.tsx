import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../firebase/orderService", () => ({
  createOrder: jest.fn(),
}));

jest.mock("../firebase/firebaseConfig", () => ({
  auth: {
    currentUser: {
      uid: "test-user-id",
      email: "test@example.com",
    },
  },
  db: {},
}));

jest.mock("../firebase/productService", () => ({
  getAllProducts: jest.fn(),
}));

import Home from "../pages/Home";
import Cart from "../cart/Cart";
import cartReducer from "../cart/cartSlice";
import { getAllProducts } from "../firebase/productService";

const mockedGetAllProducts = getAllProducts as jest.Mock;

const mockProducts = [
  {
    id: "1",
    title: "Wireless Headphones",
    price: 199.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation.",
    image: "https://www.jvc.com/usa/headphones.thumb.480.300.png",
    rating: {
      rate: 4.5,
      count: 120,
    },
  },
];

const renderWithProviders = () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        items: [],
      },
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Home />
        <Cart />
      </QueryClientProvider>
    </Provider>
  );

  return store;
};

describe("Cart Integration Test", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedGetAllProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("adds a Firebase product to the cart from the Home page", async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Wireless Headphones/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Add to Cart/i }));

    expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/^Price: \$199.99$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Total Products: 1$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Total Price: \$199.99$/i)).toBeInTheDocument();
  });
});