import { useState } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const submit = async (e) => {
  e.preventDefault();
  const loggedUser = await login(email, password, role);
  console.log(loggedUser);
  if (!loggedUser || !loggedUser.role) {
  alert("Invalid login. Role missing.");
  return;
}
  if (loggedUser.role.toLowerCase() === "admin") {
  navigate("/admin");
} else {
  navigate("/user");
}

};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-200 p-6">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/40 animate-fadeInUp">
        
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">
          Welcome Back 👋
        </h2>
        
        <form onSubmit={submit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all bg-white/80"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all bg-white/80"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
            />
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Login as</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Login
          </button>

        </form>

        {/* Footer text */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{" "}
          <span className="text-pink-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
