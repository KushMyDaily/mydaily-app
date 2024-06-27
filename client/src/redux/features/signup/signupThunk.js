import { createAsyncThunk } from "@reduxjs/toolkit";
import { signupRequest, signupSuccess, signupFailure } from "./signupSlice";
import { API } from "../../../services/apiBuilder";

export const signupUser = createAsyncThunk(
  "signup/signupUser",
  async (userData, { dispatch }) => {
    dispatch(signupRequest());
    try {
      const response = await API.post("/auth/signup", userData);
      dispatch(signupSuccess(response.data));
    } catch (error) {
      dispatch(signupFailure(error.response?.data?.message));
    }
  },
);
