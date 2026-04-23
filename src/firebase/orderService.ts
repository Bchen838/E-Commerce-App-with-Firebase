import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { Order } from "../types/order"



const ordersCollectionRef = collection(db, "orders");

export const createOrder = async (order: Omit<Order, "id" | "createdAt">): Promise<void> => {
    await addDoc(ordersCollectionRef, {
        ...order,
        createdAt: serverTimestamp(),
    });
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    const ordersQuery = query(ordersCollectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(ordersQuery);

    return querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<Order, "id">),
    }));
};