import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Sign up in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Insert into users table with id = auth user id
    const { user } = data;
    if (!user) {
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('users')
      .insert([{ id: user.id, email: user.email, role: 'user' }]);

    if (dbError) console.error('DB insert error:', dbError);

    alert('Signup successful! Check your email to confirm.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-red-700 text-center mb-6">Create Account</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7446E0]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#7446E0]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-red-700 text-white py-3 rounded-md font-semibold transition-colors 
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-900'}`}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Signing up...
              </>
            ) : (
              'Signup'
            )}
          </button>
        </form>

        {user && <p className="text-center mt-4 text-gray-600">Logged in as: {user.email}</p>}
      </div>
    </div>
  );
};

export default Signup;
