import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);

  const nav = useNavigate();

  useEffect(() => {
    if (token) nav("/dashboard");
  }, [token]);

  const login = () => {
    dispatch(loginUser(form));
  }
};
