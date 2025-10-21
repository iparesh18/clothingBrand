import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const addToCart = (product) => {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = savedCart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    savedCart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(savedCart));
  alert(`${product.name} added to cart!`);

  // Trigger a custom event to update Navbar
  window.dispatchEvent(new Event("cartUpdated"));
};

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
<div className="p-4  min-h-screen">
  <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">MEN'S ESSENTIALS</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-[#1E1E1E] rounded-xl shadow-xl p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="w-full aspect-[3/4] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-[16/9] overflow-hidden rounded-lg mb-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
          />
        </div>
        <h3 className="font-semibold text-lg text-white mb-1">{product.name}</h3>
        <p className="text-green-500 font-semibold mb-2">₹{product.price}</p>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-auto bg-red-900 text-white py-2 px-6 rounded-full hover:bg-[#5a34c4] transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    ))}
  </div>
</div>

  );
};

export default Products;
