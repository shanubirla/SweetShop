import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sweetsReducer from "./slices/sweetsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sweets: sweetsReducer,
  },
});
