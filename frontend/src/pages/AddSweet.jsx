import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';


export default function AddSweet() {
const navigate = useNavigate();


const [form, setForm] = useState({
name: '',
category: '',
price: '',
quantity: ''
});


const submit = async (e) => {
e.preventDefault();
await API.post('/sweets', form);
navigate('/admin');
};


return (
<div className="page-card">
<h2 className="title">Add New Sweet</h2>
<form onSubmit={submit} className="form">
<input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
<input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
<input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
<input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />


<button className="btn bg-pink-600 text-white w-full">Add Sweet</button>
</form>
</div>
);
}