import jwt_decode from "jwt-decode";

export const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwt_decode(token);
  return decoded.role;
};
