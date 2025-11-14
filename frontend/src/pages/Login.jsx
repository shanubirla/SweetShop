import { useState } from "react";
import api from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>

        <Link to="/register" className="block text-center mt-3 text-blue-600">
          Create an account
        </Link>
      </div>
    </div>
  );
}
