import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { setUser, setRole } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return alert(error.message);

    setUser(null);
    setRole(null);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white text-red-700 py-.5 px-4 rounded-md font-semibold hover:bg-gray-200 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
