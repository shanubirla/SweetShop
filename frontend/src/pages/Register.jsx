import { useState } from "react";
import api from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      alert("Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <input
          name="fullname"
          placeholder="Full Name"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

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
          onClick={register}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Register
        </button>

        <Link to="/" className="block text-center mt-3 text-blue-600">
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
