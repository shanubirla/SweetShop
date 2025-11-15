import { useEffect, useState } from "react";
import API from "../api/api";
import SweetCard from "../components/SweetCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await API.get("/sweets");
    setSweets(data.sweets || data);
  };

  const addToCart = (sweet) => {
    setCart((prev) => [...prev, sweet]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((s) => s._id !== id));
  };

  const purchase = async (id) => {
    await API.post(`/sweets/${id}/purchase`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Sweets 🍬</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {sweets.map((s) => (
          <div key={s._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{s.name}</h3>
            <p>{s.category}</p>
            <p>₹{s.price}</p>
            <p>Stock: {s.quantity}</p>

            <button
              className="btn bg-pink-600 text-white w-full mt-2"
              onClick={() => addToCart(s)}
            >
              Add to Cart
            </button>

            <button
              className="btn bg-green-600 text-white w-full mt-2"
              onClick={() => purchase(s._id)}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold my-6">Your Cart 🛒</h2>

      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <span>{item.name} - ₹{item.price}</span>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
