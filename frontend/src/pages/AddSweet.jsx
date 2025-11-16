import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddSweet() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("quantity", form.quantity);
    data.append("image", image);

    await API.post("/sweets", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-200 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 border border-pink-200">
        
        <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
          🍬 Add a New Sweet
        </h2>

        {preview && (
          <div className="w-full mb-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg shadow-md border border-pink-200"
            />
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">
              Sweet Name
            </label>
            <input
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">
              Category
            </label>
            <input
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-pink-700">
                Price (₹)
              </label>
              <input
                type="number"
                className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-pink-700">
                Quantity
              </label>
              <input
                type="number"
                className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-pink-700">
              Sweet Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 border border-pink-300 rounded-lg bg-pink-50 cursor-pointer focus:outline-none"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>

          <button
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg shadow transition-all"
          >
            Add Sweet 🍭
          </button>
        </form>
      </div>
    </div>
  );
}
