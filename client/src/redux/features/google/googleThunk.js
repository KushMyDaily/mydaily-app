import { createAsyncThunk } from "@reduxjs/toolkit";
import { googleSuccess, googleFailure } from "./googleSlice";
import { API } from "../../../services/apiBuilder";

export const google = createAsyncThunk(
  `google/signin`,
  async (userId, { dispatch }) => {
    try {
      const response = await API.post("/google/auth/", userId);
      dispatch(googleSuccess(response.data));
    } catch (error) {
      dispatch(googleFailure(error.response.data.message));
    }
  },
);
