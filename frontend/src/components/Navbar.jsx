import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';
import SearchBar from './SearchBar';


export default function NavBar() {
const { user, logout } = useAuth();


return (
<nav className="bg-white shadow p-4 flex justify-between items-center">
<Link to="/" className="text-2xl font-bold text-pink-600">SweetShop</Link>
<SearchBar />
<div className="flex gap-4">
{user ? (
<>
{user.role === 'admin' && <Link to="/admin" className="btn">Admin</Link>}
<button onClick={logout} className="btn-outline">Logout</button>
</>
) : (
<>
<Link to="/login" className="btn-outline">Login</Link>
<Link to="/register" className="btn bg-pink-600 text-white">Register</Link>
</>
)}
</div>
</nav>
);
}