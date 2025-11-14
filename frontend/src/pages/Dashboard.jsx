import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSweets } from "../store/slices/sweetsSlice";
import { logout } from "../store/slices/authSlice";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { getRole } from "../utils/getRole";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.sweets);
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const role = getRole();

  const [search, setSearch] = useState("");

  // MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [restockAmount, setRestockAmount] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  // Load sweets
  useEffect(() => {
    if (token) dispatch(fetchSweets());
  }, [dispatch, token]);

  // Purchase
  const handlePurchase = async (id) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      dispatch(fetchSweets());
    } catch {
      alert("Failed to purchase");
    }
  };

  // Open Add Modal
  const handleAddSweet = () => {
    setForm({ name: "", category: "", price: "", quantity: "" });
    setShowAddModal(true);
  };

  // Add Sweet
  const addSweet = async () => {
    try {
      await api.post("/sweets", form);
      setShowAddModal(false);
      dispatch(fetchSweets());
    } catch {
      alert("Failed to add sweet");
    }
  };

  // Open Edit Modal
  const handleEditSweet = (sweet) => {
    setSelectedSweet(sweet);
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    });
    setShowEditModal(true);
  };

  // Update Sweet
  const updateSweet = async () => {
    try {
      await api.put(`/sweets/${selectedSweet._id}`, form);
      setShowEditModal(false);
      dispatch(fetchSweets());
    } catch {
      alert("Failed to update sweet");
    }
  };

  // Delete Sweet
  const deleteSweet = async (id) => {
    if (!confirm("Delete this sweet?")) return;
    try {
      await api.delete(`/sweets/${id}`);
      dispatch(fetchSweets());
    } catch {
      alert("Delete failed");
    }
  };

  // Restock Modal
  const handleRestockSweet = (sweet) => {
    setSelectedSweet(sweet);
    setRestockAmount("");
    setShowRestockModal(true);
  };

  // Restock API
  const restockSweet = async () => {
    try {
      await api.post(`/sweets/${selectedSweet._id}/restock`, {
        amount: restockAmount,
      });
      setShowRestockModal(false);
      dispatch(fetchSweets());
    } catch {
      alert("Restock failed");
    }
  };

  // Filter sweets
  const filtered = items.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      {/* TOP BAR */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Sweet Shop Dashboard</h1>

        <div className="flex gap-3">
          {role === "admin" && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleAddSweet}
            >
              + Add Sweet
            </button>
          )}

          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search sweets..."
        className="w-full p-2 border rounded mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SWEETS GRID */}
      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((sweet) => (
            <div key={sweet._id} className="p-4 bg-white shadow rounded">
              <h2 className="text-xl font-bold mb-1">{sweet.name}</h2>
              <p className="text-gray-600">{sweet.category}</p>
              <p className="font-semibold">₹{sweet.price}</p>
              <p className="text-sm text-gray-500">Stock: {sweet.quantity}</p>

              <button
                className={`w-full mt-3 p-2 rounded text-white ${
                  sweet.quantity > 0
                    ? "bg-blue-600"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={sweet.quantity === 0}
                onClick={() => handlePurchase(sweet._id)}
              >
                {sweet.quantity > 0 ? "Purchase" : "Out of Stock"}
              </button>

              {/* ADMIN BUTTONS */}
              {role === "admin" && (
                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEditSweet(sweet)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                    onClick={() => handleRestockSweet(sweet)}
                  >
                    Restock
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => deleteSweet(sweet._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD SWEET MODAL */}
      {showAddModal && (
        <Modal title="Add Sweet" onClose={() => setShowAddModal(false)}>
          <SweetForm form={form} setForm={setForm} onSubmit={addSweet} />
        </Modal>
      )}

      {/* EDIT SWEET MODAL */}
      {showEditModal && (
        <Modal title="Edit Sweet" onClose={() => setShowEditModal(false)}>
          <SweetForm form={form} setForm={setForm} onSubmit={updateSweet} />
        </Modal>
      )}

      {/* RESTOCK MODAL */}
      {showRestockModal && (
        <Modal title="Restock Sweet" onClose={() => setShowRestockModal(false)}>
          <div>
            <label className="font-semibold">New Quantity</label>
            <input
              type="number"
              className="w-full border p-2 rounded my-2"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
            />

            <button
              className="bg-purple-600 text-white px-4 py-2 rounded w-full"
              onClick={restockSweet}
            >
              Restock
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ MODAL COMPONENT ============ */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-5 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {children}

        <button
          className="mt-4 bg-gray-400 text-white px-4 py-2 rounded w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ============ SWEET FORM COMPONENT ============ */
function SweetForm({ form, setForm, onSubmit }) {
  return (
    <div>
      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <input
        type="number"
        className="w-full p-2 border rounded mb-2"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        type="number"
        className="w-full p-2 border rounded mb-2"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />

      <button
        className="w-full bg-green-600 text-white p-2 rounded"
        onClick={onSubmit}
      >
        Save
      </button>
    </div>
  );
}
