import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";


const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusInputs, setStatusInputs] = useState({}); // store status per order
  const { user, role } = useAuth();


  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Failed to fetch orders: " + error.message);
    } else {
      setOrders(data);
      // initialize status inputs
      const inputs = {};
      data.forEach((order) => {
        inputs[order.id] = order.status || "";
      });
      setStatusInputs(inputs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status
  const updateStatus = async (orderId) => {
    const newStatus = statusInputs[orderId];
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      fetchOrders(); // refresh orders
    }
  };

  const handleInputChange = (orderId, value) => {
    setStatusInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  return loading ? (
    <p>Loading orders...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>User :</strong> {user.email}</p>
          <p><strong>User ID:</strong> {order.user_id}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Total:</strong> ₹{order.total_price}</p>

          <div>
            <strong>Items:</strong>
            <ul className="list-disc list-inside mt-1">
              {JSON.parse(order.items).map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <input
              type="text"
              placeholder="Enter status"
              value={statusInputs[order.id] || ""}
              onChange={(e) => handleInputChange(order.id, e.target.value)}
              className="border p-2 rounded-md w-full"
            />
            <button
              onClick={() => updateStatus(order.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Save Status
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTable;
