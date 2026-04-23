import Home from './pages/Home.tsx'
import Cart from './cart/Cart.tsx'
import { useEffect, useState } from 'react';
import { auth } from './firebase/firebaseConfig.ts';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Profile from './pages/Profile.tsx';
import ProductManagement from './pages/ProductManagement.tsx';
import OrderHistory from "./pages/OrderHistory";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged out!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert("Logout failed: " + err.message);
            } else {
                alert("An unknown error occurred during logout.");
            }
        }
    };

    if (authLoading) {
      return <p>Loading...</p>;
    }


  return (
    <div>
      {user ? (
        <>
        <h2>Welcome, {user.email}</h2>
        <button onClick={handleLogout}>Logout</button>
        < ProductManagement />
        <Profile />
        <Home />
        <Cart />
        <OrderHistory />
        </>
      ) : (
        <>
        <Register />
        <Login />
        </>
      )}
    </div>
  );
}

export default App;