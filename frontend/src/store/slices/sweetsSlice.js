import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// FETCH SWEETS
export const fetchSweets = createAsyncThunk(
  "sweets/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/sweets");
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to load sweets");
    }
  }
);

const sweetsSlice = createSlice({
  name: "sweets",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSweets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sweetsSlice.reducer;
