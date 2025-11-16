import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ss_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Set axios token header on load OR when user updates
  useEffect(() => {
    if (user?.token) {
      API.defaults.headers.Authorization = `Bearer ${user.token}`;
      localStorage.setItem("ss_user", JSON.stringify(user));
    } else {
      API.defaults.headers.Authorization = null;
      localStorage.removeItem("ss_user");
    }
  }, [user]);

  // --------------------------
  // LOGIN
  // --------------------------
  const login = async (email, password, role) => {
    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
        role,
      });

      // Creating consistent payload **ALWAYS includes role**
      const payload = {
        id: data.user.id || data.user._id,
        fullname: data.user.fullname,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };

      setUser(payload);
      return payload;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return null;
    }
  };

  // --------------------------
  // REGISTER
  // --------------------------
  const register = async (fullname, email, password, role) => {
    try {
      const { data } = await API.post("/auth/register", {
        fullname,
        email,
        password,
        role,
      });

      const payload = {
        id: data.user.id || data.user._id,
        fullname: data.user.fullname,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };

      setUser(payload);
      return payload;
    } catch (error) {
      console.error("Register failed:", error.response?.data || error.message);
      return null;
    }
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ss_user");
    API.defaults.headers.Authorization = null;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
