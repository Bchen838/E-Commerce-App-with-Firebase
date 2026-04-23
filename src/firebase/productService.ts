import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import {  type Product } from "../types/product";



const productsCollectionRef = collection(db, "products");

export const createProduct = async (product: Omit<Product, "id">): Promise<void> => {
    await addDoc(productsCollectionRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const getAllProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(productsCollectionRef);

  const products = querySnapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...(docSnapshot.data() as Omit<Product, "id">),
  }));

  return products;
};

export const updateProduct = async (productId: string, updatedData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
    const productDocRef = doc(db, "products", productId);

    await updateDoc(productDocRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
    });
};

export const deleteProduct = async (productId: string): Promise<void> => {
    const productDocRef = doc(db, "products", productId);
    await deleteDoc(productDocRef);
};