import type { CartItem } from "../cart/cartSlice";
import type { Timestamp } from "firebase/firestore";

export interface Order {
    id?: string;
    userId: string;
    userEmail: string;
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    createdAt: Timestamp;
}