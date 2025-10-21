import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import OrdersTable from "../components/OrdersTable"
import { useNavigate } from "react-router-dom";




const AdminPanel = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState("addProduct");
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageFile: null, // file object
    description: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);


  // Fetch all products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload image to Supabase Storage and return public URL
 const uploadImage = async (file) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    alert("Image upload failed: " + err.message);
    return null;
  }
};


  // Add new product
 const handleAddProduct = async (e) => {
  e.preventDefault();
  console.log(formData); // check if imageFile exists
  const { name, price, imageFile, description } = formData;

  if (!imageFile) {
    alert("Please select an image!");
    return;
  }

  const image_url = await uploadImage(imageFile);
  if (!image_url) return;

  const { error } = await supabase
    .from("products")
    .insert([{ name, price, image_url, description }]);

  if (error) {
    alert("Insert failed: " + error.message);
    console.error(error);
  } else {
    alert("Product added successfully!");
    setFormData({ name: "", price: "", imageFile: null, description: "" });
    fetchProducts();
  }
};


  // Delete product
  const handleDelete = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) fetchProducts();
    else alert("Delete failed: " + error.message);
  };

  const menuItems = [
    { id: "addProduct", label: "Add Product" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-zinc-900 text-white flex-col p-4 space-y-4 fixed top-0 left-0 h-full">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`py-2 px-4 rounded-md text-left hover:bg-[#c43434] ${
              active === item.id ? "bg-red-900/100" : ""
            }`}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Top Menu */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-zinc-900 text-white z-50 shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-red-700" onClick={()=>navigate("/")}>Admin Panel</h2>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-zinc-900 flex flex-col p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`py-2 px-4 text-left hover:bg-[#c43434] ${
                  active === item.id ? "bg-red-900/100" : ""
                }`}
                onClick={() => {
                  setActive(item.id);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#F5F5F5] p-6 mt-16 md:mt-0 md:ml-64 overflow-y-auto h-screen">
        {/* Add Product Form */}
        {active === "addProduct" && (
<form
  onSubmit={handleAddProduct}
  className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-zinc-800/70 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto backdrop-blur-md hover:border-zinc-700 transition-all duration-300"
>
  {/* Accent Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ff3b3020,_transparent_70%)] pointer-events-none"></div>

  {/* Heading */}
  <h3 className="text-3xl font-semibold bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent mb-6">
    Add Product
  </h3>

  {/* Inputs */}
  <div className="space-y-5 text-gray-200 relative z-10">
    <input
      type="text"
      placeholder="Product Name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
      required
    />

    <input
      type="number"
      placeholder="Price"
      value={formData.price}
      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
      required
    />

    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setFormData({ ...formData, imageFile: e.target.files[0] })
      }
      className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
      required
    />

    <textarea
      placeholder="Description"
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
      className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm min-h-[100px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
      required
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="mt-6 w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-red-600/30 hover:scale-[1.02] transition-all duration-300"
  >
    Add Product
  </button>
</form>

        )}

        {/* Products List */}
        {active === "products" && (
          <div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">All Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-32 h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-gray-600">₹{p.price}</p>
                  <p className="text-sm text-gray-500 mb-3">{p.description}</p>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {active === "orders" && (
  <div>
    <h3 className="text-2xl font-bold text-red-700 mb-6">All Orders</h3>

    <OrdersTable />
  </div>
)}
      </div>
    </div>
  );
};

export default AdminPanel;
