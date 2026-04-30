import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, fireEvent, screen } from "@testing-library/react";
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
}));

import Cart from "../cart/Cart";
import cartReducer from "../cart/cartSlice";

type CartItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity: number;
};

type TestCartState = {
  items: CartItem[];
};

type TestPreloadedState = {
  cart: TestCartState;
};

const renderWithStore = (preloadedState: TestPreloadedState) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );

  return store;
};

describe("Cart Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("renders cart items, total products, and total price", () => {
    renderWithStore({
      cart: {
        items: [
          {
            id: "1",
            title: "Wireless Headphones",
            price: 199.99,
            category: "Electronics",
            description:
              "High-quality wireless headphones with noise cancellation.",
            image: "https://www.jvc.com/usa/headphones.thumb.480.300.png",
            rating: {
              rate: 4.5,
              count: 120,
            },
            quantity: 2,
          },
        ],
      },
    });

    expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Wireless Headphones/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Wireless Headphones/i)).toBeInTheDocument();
    expect(screen.getByText(/Count: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/^Price: \$399.98$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Total Products: 2$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Total Price: \$399.98$/i)).toBeInTheDocument();
  });

  test("removes item from cart when Remove button is clicked", () => {
    renderWithStore({
      cart: {
        items: [
          {
            id: "1",
            title: "Wireless Headphones",
            price: 199.99,
            category: "Electronics",
            description:
              "High-quality wireless headphones with noise cancellation.",
            image: "https://www.jvc.com/usa/headphones.thumb.480.300.png",
            rating: {
              rate: 4.5,
              count: 120,
            },
            quantity: 1,
          },
        ],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Remove/i }));

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByText(/Wireless Headphones/i)).not.toBeInTheDocument();
  });
});