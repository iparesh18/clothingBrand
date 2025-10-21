import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './pages/AdminPanel'; // create this page
import Products from "./pages/Products";
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* push content below navbar */}
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<MyOrders />} />

    <Route path="/products" element={<Products />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />

  {/* Admin Protected */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute adminOnly={true}>
        <AdminPanel />
      </ProtectedRoute>
    }
  />
</Routes>

      </div>
    </Router>
  );
}

export default App;
