import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [sweets, setSweets] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("sweetShopUser"));

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await API.get("/sweets");
      setSweets(res.data.sweets);
    } catch (err) {
      console.error("Fetch sweets error:", err);
    }
  };

  // Auto slide
  useEffect(() => {
    if (sweets.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === Math.min(4, sweets.length - 1) ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [sweets]);

  // If not logged in → redirect to login
  const handleAction = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(user.role === "admin" ? "/admin" : "/user");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ------ SLIDER ------ */}
      {sweets.length > 0 && (
        <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-xl shadow-lg mb-10">

          <div
            className="flex w-full h-full transition-transform duration-700"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sweets.slice(0, 5).map((s) => (
              <img
                key={s._id}
                src={s.imageUrl}
                alt="Sweet"
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {sweets.slice(0, 5).map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  currentSlide === index
                    ? "bg-pink-600 scale-110"
                    : "bg-white opacity-70"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* ------ SWEETS GRID ------ */}
      <h2 className="text-2xl font-bold mb-4 text-pink-700">
        Available Sweets 🍬
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sweets.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 shadow rounded-xl border border-pink-100"
          >
            <img
              src={s.imageUrl}
              alt={s.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h3 className="mt-2 text-lg font-semibold text-gray-800">
              {s.name}
            </h3>

            <p className="text-sm text-gray-600">{s.category}</p>

            <p className="font-bold text-pink-700">₹{s.price}</p>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAction}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
              >
                Add to Cart
              </button>

              <button
                onClick={handleAction}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
