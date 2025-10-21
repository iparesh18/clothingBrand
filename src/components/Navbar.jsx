import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count on mount
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(savedCart.reduce((acc, item) => acc + item.quantity, 0));
    };

    updateCartCount(); // initial load
    window.addEventListener("cartUpdated", updateCartCount);

    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Signup</Link>
        </>
      );
    }

    return (
      <>
        <span>{user.email}</span>

        {/* My Orders visible for all logged-in users */}
        <Link to="/orders" className="hover:underline">
          My Orders
        </Link>

        {role === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin Panel
          </Link>
        )}
        <LogoutButton />
      </>
    );
  };

  return (
    <nav className="bg-[#000000] text-white fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 font-bold text-xl text-red-700">
            <Link to="/">MENS CLUB.</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/checkout" className="hover:underline">
              Cart ({cartCount})
            </Link>
            {renderLinks()}
          </div>

          {/* Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-tr from-red-900  to-black text-white transform ${
          open ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 flex flex-col p-6`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="font-bold text-xl">Menu</span>
          <button onClick={() => setOpen(false)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/" onClick={() => setOpen(false)} className="hover:underline">Home</Link>
          <Link to="/products" onClick={() => setOpen(false)} className="hover:underline">Products</Link>
          <Link to="/checkout" onClick={() => setOpen(false)} className="hover:underline">
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <span>{user.email}</span>
              <Link to="/orders" onClick={() => setOpen(false)} className="hover:underline">
                My Orders
              </Link>
              {role === "admin" && (
                <Link to="/admin" onClick={() => setOpen(false)} className="hover:underline">
                  Admin Panel
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="hover:underline bg-white text-red-700 rounded-xl p-3 text-center">Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="hover:underline bg-white text-red-700 rounded-xl p-3 text-center">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



