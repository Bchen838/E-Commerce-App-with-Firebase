import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { getOrdersByUserId } from "../firebase/orderService";
import type { Order } from "../types/order";

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError("You must be logged in to view order history.");
                setLoading(false);
                return;
            }

            try {
                const data = await getOrdersByUserId(currentUser.uid);
                setOrders(data);
                setError("");
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to load order history");
                }
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    if (loading) {
        return <p>Loading order history...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (orders.length === 0) {
        return <p>No previous orders found.</p>;
    }

    return (
        <div>
            <h2>Order History</h2>

            {orders.map((order) => (
                <div
                    key={order.id}
                    style={{ border: "2px solid black", margin: "10px", padding: "10px" }}
                >
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p>
                        <strong>Date:</strong>{" "}
                        {order.createdAt?.toDate().toLocaleString()}
                    </p>
                    <p><strong>Total Items:</strong> {order.totalQuantity}</p>
                    <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>

                    <button onClick={() => toggleOrderDetails(order.id!)}>
                        {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                    </button>

                    {expandedOrderId === order.id && (
                        <div>
                            <h3>Order Details</h3>

                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        border: "1px solid gray",
                                        margin: "10px 0",
                                        padding: "10px",
                                    }}
                                >
                                    <p><strong>Product:</strong> {item.title}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                                    <p>
                                        <strong>Subtotal:</strong> $
                                        {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <img src={item.image} alt={item.title} width={80} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;