import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/product";

export interface CartItem extends Product {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const loadCartFromSessionStorage = (): CartItem[] => {
  const storedCart = sessionStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToSessionStorage = (items: CartItem[]) => {
  sessionStorage.setItem("cart", JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCartFromSessionStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      if (!action.payload.id) {
        return;
      }

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          id: action.payload.id,
          quantity: 1,
        });
      }

      saveCartToSessionStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToSessionStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;