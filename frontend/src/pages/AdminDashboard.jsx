import React, { useEffect, useState } from 'react';
import API from '../api/api';
import Sidebar from '../components/sidebar.jsx';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState({ labels: [], values: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // fetch sweets
  const fetchSweets = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/sweets', {
        params: { search: query, category, sort, page, limit }
      });
      setSweets(data.sweets || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/dashboard/stats', { params: { days: 30 } });
      setStats(data.stats);
      const hist = data.stats.salesHistory || [];
      const labels = hist.map(h => h._id);
      const values = hist.map(h => h.totalSales);
      setSalesData({ labels, values });

      // categories list
      setCategories(data.stats.categories.map(c => c._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchSweets(); }, [query, category, sort, page]);

  const del = async (id) => {
    if (!window.confirm('Delete this sweet?')) return;
    await API.delete(`/sweets/${id}`);
    fetchSweets();
    fetchStats();
  };

  const onPurchase = async (id) => {
    const qty = Number(prompt('Purchase quantity', 1));
    if (!qty || qty <= 0) return;
    try {
      await API.post(`/sweets/${id}/purchase`, { quantity: qty });
      fetchSweets();
      fetchStats();
      alert('Purchase recorded.');
    } catch (err) {
      alert(err?.response?.data?.message || 'Purchase failed');
    }
  };

  // pagination
  const pages = Math.ceil(total / limit);

  // chart config
  const chartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: salesData.values,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 3,
        fill: true,
        backgroundColor: 'rgba(255, 205, 210, 0.35)',
        borderColor: 'rgba(239, 68, 68, 0.8)'
      }
    ]
  };

  return (
    <div className={darkMode ? 'min-h-screen bg-slate-900 text-gray-100' : 'min-h-screen bg-gradient-to-br from-rose-50 via-peach-50 to-mint-50'}>
      <div className="flex">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-rose-700">🍬 Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Pastel analytics & inventory</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                className="px-3 py-2 rounded-lg border shadow-sm focus:outline-none"
                placeholder="Search sweets..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
              <select className="px-3 py-2 rounded-lg border" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                <option value="">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="px-3 py-2 rounded-lg border" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="">Sort</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="stock_asc">Stock ↑</option>
                <option value="stock_desc">Stock ↓</option>
              </select>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/40 shadow hover:shadow-lg transition">
              <div className="text-sm text-gray-500">Total Sweets</div>
              <div className="text-2xl font-bold text-rose-600">{stats ? stats.totalSweets : '—'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/40 shadow hover:shadow-lg transition">
              <div className="text-sm text-gray-500">Low Stock (&le;5)</div>
              <div className="text-2xl font-bold text-amber-600">{stats ? stats.lowStockCount : '—'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/40 shadow hover:shadow-lg transition">
              <div className="text-sm text-gray-500">Categories</div>
              <div className="text-2xl font-bold text-emerald-600">{stats ? stats.categories.length : '—'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/40 shadow hover:shadow-lg transition">
              <div className="text-sm text-gray-500">Revenue (30d)</div>
              <div className="text-2xl font-bold text-purple-600">₹{stats ? stats.totalRevenue.toFixed(0) : '—'}</div>
            </div>
          </div>

          {/* Chart & list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white/80 p-6 rounded-2xl border border-white/30 shadow">
              <h3 className="font-semibold text-gray-700 mb-4">Revenue (last 30 days)</h3>
              <Line data={chartData} />
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-white/30 shadow">
              <h3 className="font-semibold text-gray-700 mb-3">Top Categories</h3>
              <ul className="space-y-2">
                {stats?.categories?.slice(0, 6).map(c => (
                  <li key={c._id} className="flex justify-between items-center">
                    <span className="text-gray-700">{c._id}</span>
                    <span className="text-sm font-semibold text-gray-600">{c.count}</span>
                  </li>
                )) || <li className="text-gray-500">No categories</li>}
              </ul>
            </div>
          </div>

          {/* Sweets grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <div>Loading...</div> : sweets.map(s => (
              <div key={s._id} className="bg-white/90 p-5 rounded-2xl border border-white/30 shadow hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-rose-600">{s.name}</h4>
                    <p className="text-sm text-gray-500">{s.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800 font-semibold">₹{s.price}</div>
                    <div className="text-xs text-gray-500">{s.quantity} in stock</div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600">{s.description?.slice(0, 80)}</p>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => window.location = `/admin/edit/${s._id}`} className="px-3 py-1 rounded-lg border text-rose-600 font-semibold">Edit</button>
                  <button onClick={() => del(s._id)} className="px-3 py-1 rounded-lg border text-red-600 font-semibold">Delete</button>
                  <button onClick={() => onPurchase(s._id)} className="ml-auto px-3 py-1 rounded-lg bg-rose-500 text-white font-semibold">Purchase</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <button className="px-3 py-2 rounded border" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <div className="px-3 py-2 rounded border">Page {page} / {pages || 1}</div>
            <button className="px-3 py-2 rounded border" onClick={() => setPage(p => Math.min(pages || 1, p + 1))} disabled={page === pages}>Next</button>
          </div>

        </main>
      </div>
    </div>
  );
}
