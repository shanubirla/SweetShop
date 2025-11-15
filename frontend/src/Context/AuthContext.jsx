import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ss_user')) || null);


useEffect(() => {
if (user?.token) API.defaults.headers.Authorization = `Bearer ${user.token}`;
localStorage.setItem('ss_user', JSON.stringify(user));
}, [user]);


const login = async (email, password, role) => {
  const { data } = await API.post("/auth/login", { email, password, role });

  const payload = { ...data.user, token: data.token };
  setUser(payload);
  return payload;
};



const register = async (fullname, email, password, role) => {
  const { data } = await API.post("/auth/register", {
    fullname,
    email,
    password,
    role
  });

  const payload = { ...data.user, token: data.token };
  setUser(payload);
  return payload;
};



const logout = () => setUser(null);


return (
<AuthContext.Provider value={{ user, login, register, logout }}>
{children}
</AuthContext.Provider>
);
};