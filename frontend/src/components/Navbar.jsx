import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("sweetShopUser"));

  const logout = () => {
    localStorage.removeItem("sweetShopUser");
    navigate("/");
  };

  return (
    <nav className="p-4 bg-pink-600 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">SweetShop 🍭</Link>

      <div className="flex items-center gap-4">

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && user.role === "user" && (
          <Link to="/user" className="font-semibold">Dashboard</Link>
        )}

        {user && user.role === "admin" && (
          <Link to="/admin" className="font-semibold">Admin Panel</Link>
        )}

        {user && (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
