import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ darkMode, setDarkMode }) {
  return (
    <aside className="w-64 min-h-screen p-6 bg-white/60 backdrop-blur-lg border-r border-white/30">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-rose-600">Candy Admin</h2>
        <p className="text-sm text-gray-600 mt-1">Pastel Sweet Shop</p>
      </div>

      <nav className="flex flex-col gap-2">
        <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-rose-50 transition font-semibold">Dashboard</Link>
        <Link to="/admin/add" className="px-3 py-2 rounded-lg hover:bg-rose-50 transition font-semibold">Add Sweet</Link>
        <Link to="/admin/analytics" className="px-3 py-2 rounded-lg hover:bg-rose-50 transition font-semibold">Analytics</Link>
        <Link to="/admin/orders" className="px-3 py-2 rounded-lg hover:bg-rose-50 transition font-semibold">Orders</Link>
      </nav>

      <div className="mt-8">
        <label className="inline-flex items-center gap-3">
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="form-checkbox h-5 w-5 rounded" />
          <span className="text-sm">Dark mode</span>
        </label>
      </div>

      <div className="mt-8 text-xs text-gray-500">
        <div>v1.0 — Pastel Theme</div>
      </div>
    </aside>
  );
}
