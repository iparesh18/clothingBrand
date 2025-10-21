import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import DecryptedText from '../components/DecryptedText';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated")); // update navbar count
  };

  // Place order
const placeOrder = async () => {
  if (!address || !phone) {
    alert("Please enter address and phone number!");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  try {
    // 1️⃣ Get current logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return alert("Login first");

    // 2️⃣ Upsert the user into public.users to match FK
    await supabase
      .from("users")
      .upsert(
        { id: user.id, email: user.email, role: "user" }, // role=user for normal users
        { onConflict: "id" }
      );

    // 3️⃣ Prepare order items
    const orderItems = cart.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    // 4️⃣ Insert the order
    const { data, error } = await supabase
      .from("orders")
      .insert([{
        user_id: user.id,
        items: JSON.stringify(orderItems),
        total_price: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        address,
        phone,
        status: "Pending"
      }]);

    if (error) throw error;

    // 5️⃣ Clear cart
    localStorage.removeItem("cart");
    setCart([]);
    setAddress("");
    setPhone("");

    alert("Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to place order: " + err.message);
  }
};




  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 flex justify-center items-center flex-col">
      <h2 className="text-5xl font-bold mb-4 text-center text-red-700 ">Checkout</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4 border-b pb-2"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-lg mt-2">
            Total: ₹{totalPrice}
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        onClick={placeOrder}
        disabled={loading}
        className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-900 w-full"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      <div style={{ marginTop: '4rem' }}>
<DecryptedText
className="text-2xl"
  text="BE MEN | JOIN THE CULTURE."
  animateOn="view"
  revealDirection="center"
/>
</div>
    </div>
  );
};

export default Checkout;
