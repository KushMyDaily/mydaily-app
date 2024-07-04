import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  url: null,
};

const googleSlice = createSlice({
  name: "google",
  initialState,
  reducers: {
    googleRequest: (state) => {
      state.isLoading = true;
      state.url = null;
      state.error = null;
    },
    googleSuccess: (state, action) => {
      state.isLoading = false;
      state.url = action.payload;
      state.error = null;
    },
    googleFailure: (state, action) => {
      state.isLoading = false;
      state.url = null;
      state.error = action.payload;
    },
  },
});

export const { googleRequest, googleSuccess, googleFailure } =
  googleSlice.actions;

export default googleSlice.reducer;
