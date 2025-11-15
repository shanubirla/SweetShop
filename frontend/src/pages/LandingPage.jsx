import { useEffect, useState } from 'react';
import API from '../api/api';
import SweetCard from '../components/SweetCard';


export default function LandingPage() {
const [sweets, setSweets] = useState([]);


const load = async () => {
const { data } = await API.get('/sweets');
setSweets(data.sweets || data);
};


const purchase = async (id) => {
await API.post(`/sweets/${id}/purchase`);
load();
};


useEffect(() => { load(); }, []);


return (
<div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
{sweets.map((s) => (
<SweetCard key={s._id} sweet={s} onPurchase={purchase} />
))}
</div>
);
}