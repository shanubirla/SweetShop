import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AddSweet from "./pages/AddSweet";
import EditSweet from "./pages/EditSweet";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-pink-50">
      <NavBar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/add" element={<AddSweet />} />
        <Route path="/admin/edit/:id" element={<EditSweet />} />

        <Route path="*" element={<div className="p-6">Page Not Found</div>} />
      </Routes>
    </div>
  );
}
