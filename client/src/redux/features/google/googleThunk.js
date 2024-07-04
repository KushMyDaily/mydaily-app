import { createAsyncThunk } from "@reduxjs/toolkit";
import { googleSuccess, googleFailure, googleRequest } from "./googleSlice";
import { API } from "../../../services/apiBuilder";

export const google = createAsyncThunk(
  `google/signin`,
  async (userId, { dispatch }) => {
    dispatch(googleRequest());
    try {
      const response = await API.post("/google/auth/", userId);
      dispatch(googleSuccess(response.data));
    } catch (error) {
      dispatch(googleFailure(error.response.data.message));
    }
  },
);
