import { useEffect, useState, type FormEvent } from "react";
import { deleteUser, type User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile, updateUserProfile, deleteUserProfile, type UserProfile } from "../components/UserManagement";

const Profile = () => {
    const currentUser: User | null = auth.currentUser;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (!currentUser) {
                setError("No user is currently logged in.");
                setLoading(false);
                return;
            }

            try {
                const userProfile = await getUserProfile(currentUser.uid);
                setProfile(userProfile);
                setName(userProfile.name);
                setAddress(userProfile.address);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to load profile.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [currentUser]);

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            setError("No user is currently logged in.");
            return;
        }

        try {
            await updateUserProfile(currentUser.uid, { name, address }); 

            setProfile((prev) => 
                prev ? {...prev, name, address } : prev);
            setError("");
            alert("Profile updated successfully!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update profile.");
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (!currentUser) {
            setError("No user is currently logged in.");
            return;
        }

        try {
            await deleteUserProfile(currentUser.uid);
            await deleteUser(currentUser);
            alert("Account deleted successfully!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to delete account.");
            }

        }
    };

    if (loading) {
        return <p>Loading profile...</p>
    }

    return (
        <div>
            <h2>User Profile</h2>

            {profile && <p>Email: {profile.email}</p>}

            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <button type="submit">Update Profile</button>
            </form>

            <button onClick={handleDeleteAccount}>Delete Account</button>

            {error && <p>{error}</p>}
        </div>
    );
};

export default Profile;