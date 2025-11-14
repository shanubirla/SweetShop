import { useState } from "react";
import api from "../api/client";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";

const register = () => {
  dispatch(registerUser(form));
};
