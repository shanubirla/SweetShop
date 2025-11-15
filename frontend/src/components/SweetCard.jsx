import { useAuth } from '../Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';


export default function SweetCard({ sweet, onPurchase }) {
const { user } = useAuth();
const navigate = useNavigate();


return (
<div className="bg-white shadow p-4 rounded">
<h3 className="text-xl font-bold">{sweet.name}</h3>
<p className="text-sm text-gray-500">{sweet.category}</p>
<p className="mt-2">₹{sweet.price}</p>
<p>Stock: {sweet.quantity}</p>


<div className="mt-4 flex gap-2">
<button
className={`btn w-full ${sweet.quantity <= 0 ? 'bg-gray-400' : 'bg-pink-600 text-white'}`}
disabled={sweet.quantity <= 0}
onClick={() => onPurchase(sweet._id)}
>
Purchase
</button>


{user?.role === 'admin' && (
<button className="btn-outline" onClick={() => navigate(`/admin/edit/${sweet._id}`)}>Edit</button>
)}
</div>
</div>
);
}