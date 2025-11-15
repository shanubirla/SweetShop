import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function SearchBar() {
const [query, setQuery] = useState('');
const navigate = useNavigate();


const submit = (e) => {
e.preventDefault();
navigate(`/?search=${query}`);
};


return (
<form onSubmit={submit} className="hidden md:flex">
<input
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Search sweets..."
className="border rounded-l px-3 py-2"
/>
<button className="bg-pink-600 text-white px-3 rounded-r">Search</button>
</form>
);
}