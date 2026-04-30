import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCart, removeFromCart } from "./cartSlice";
import { createOrder } from "../firebase/orderService";
import { auth } from "../firebase/firebaseConfig";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be logged in to checkout.");
      return;
    }

    try {
      await createOrder({
        userId: currentUser.uid,
        userEmail: currentUser.email ?? "",
        items: cartItems,
        totalPrice,
        totalQuantity,
      });

      dispatch(clearCart());
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Checkout failed.")
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <img src={item.image} alt={item.title} width={80} />
              <h4>{item.title}</h4>
              <p>Count: {item.quantity}</p>
              <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => dispatch(removeFromCart(item.id))}>
                Remove
              </button>
            </div>
          ))}

          <hr />
          <p>Total Products: {totalQuantity}</p>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;