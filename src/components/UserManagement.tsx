import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "../firebase/firebaseConfig";

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    address: string;
    createdAt?: unknown;
}

export const createUserProfile = async (
    uid: string,
    email: string, 
    name = "", 
    address = ""
): Promise<void> => {
    await setDoc(doc(db, "users", uid), {
        uid, 
        email,
        name,
        address,
        createdAt: serverTimestamp()
    });
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
    const userDocRef = doc(db, "users", uid); 
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        throw new Error("User profile not found"); 
    }

    return userSnapshot.data() as UserProfile;
};

export const updateUserProfile = async (
    uid: string,
    updates: Partial<Pick<UserProfile, "name" | "address">>
): Promise<void> => {
    const userDocRef = doc(db, "users", uid); 
    await updateDoc(userDocRef, updates);
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
    const userDocRef = doc(db, "users", uid);
    await deleteDoc(userDocRef);
};


