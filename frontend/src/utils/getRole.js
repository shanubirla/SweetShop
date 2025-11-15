import { jwtDecode } from "jwt-decode";

export const getRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    console.error("JWT decode failed:", err);
    return null;
  }
};
