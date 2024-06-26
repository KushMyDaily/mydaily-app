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
      state.error = null;
    },
    googleSuccess: (state, action) => {
      state.isLoading = false;
      state.url = action.payload;
    },
    googleFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { googleRequest, googleSuccess, googleFailure } =
  googleSlice.actions;

export default googleSlice.reducer;
