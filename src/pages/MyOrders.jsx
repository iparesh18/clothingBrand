import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return alert("Login first");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center mt-10">You have no orders yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
         <div
  key={order.id}
  className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-5 md:p-6 rounded-2xl shadow-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.01] overflow-hidden"
>
  {/* Glow Accent */}
  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_#ff9d2f20,_transparent_60%)] pointer-events-none"></div>

  {/* Bento Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm text-gray-300 relative z-10">
    {/* Order ID */}
    <div className="flex justify-between items-center bg-zinc-800/30 p-3 rounded-xl backdrop-blur-sm border border-zinc-700/30">
      <p className="font-semibold text-gray-400">Order ID :</p>
      <p className="font-medium text-white">{order.id}</p>
    </div>

    {/* Status */}
    <div className="flex justify-between items-center bg-zinc-800/30 p-3 rounded-xl backdrop-blur-sm border border-zinc-700/30">
      <p className="font-semibold text-gray-400">Status</p>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          order.status === "Pending"
            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
            : order.status === "Completed"
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-purple-500/20 text-white border border-gray-600/30"
        }`}
      >
        {order.status}
      </span>
    </div>

    {/* Price */}
    <div className="flex justify-between items-center bg-zinc-800/30 p-3 rounded-xl backdrop-blur-sm border border-zinc-700/30">
      <p className="font-semibold text-gray-400">Total</p>
      <p className="text-lg font-bold text-emerald-600">₹{order.total_price}</p>
    </div>

    {/* Address */}
    <div className="sm:col-span-2 md:col-span-3 bg-zinc-800/30 p-3 rounded-xl backdrop-blur-sm border border-zinc-700/30">
      <p className="font-semibold text-gray-400 mb-1">Address</p>
      <p className="text-gray-200 leading-relaxed">{order.address}</p>
    </div>

    {/* Phone */}
    <div className="sm:col-span-2 md:col-span-1 bg-zinc-800/30 p-3 rounded-xl backdrop-blur-sm border border-zinc-700/30">
      <p className="font-semibold text-gray-400 mb-1">Phone</p>
      <p className="text-gray-200">{order.phone}</p>
    </div>

    {/* Products */}
    <div className="sm:col-span-2 md:col-span-2 bg-zinc-800/30 p-3 rounded-xl backdrop-blur-sm border border-zinc-700/30">
      <p className="font-semibold text-gray-400 mb-2">Products</p>
      <ul className="space-y-1">
        {JSON.parse(order.items).map((item) => (
          <li
            key={item.product_id}
            className="flex justify-between items-center text-sm text-gray-200"
          >
            <span>{item.name}</span>
            
            <span className="text-gray-400">
              ₹{item.price} × {item.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

        ))}
      </div>
    </div>
  );
};

export default MyOrders;
