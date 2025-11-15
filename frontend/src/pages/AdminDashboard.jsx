import { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';


export default function AdminDashboard() {
const [sweets, setSweets] = useState([]);


const load = async () => {
const { data } = await API.get('/sweets');
setSweets(data.sweets || data);
};


useEffect(() => { load(); }, []);


const del = async (id) => {
if (!confirm('Delete this sweet?')) return;
await API.delete(`/sweets/${id}`);
load();
};


return (
<div className="p-6">
<div className="flex justify-between mb-4">
<h2 className="text-xl font-bold">Admin Dashboard</h2>
<Link to="/admin/add" className="btn bg-pink-600 text-white">Add Sweet</Link>
</div>


<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{sweets.map((s) => (
<div key={s._id} className="bg-white shadow p-4 rounded">
<h3 className="text-lg font-semibold">{s.name}</h3>
<p className="text-sm text-gray-500">{s.category}</p>
<p className="mt-1">₹{s.price} • {s.quantity} in stock</p>


<div className="mt-3 flex gap-2">
<Link to={`/admin/edit/${s._id}`} className="btn-outline">Edit</Link>
<button onClick={() => del(s._id)} className="btn-outline">Delete</button>
</div>
</div>
))}
</div>
</div>
);
}