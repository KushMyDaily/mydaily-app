import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signinRequest,
  signinSuccess,
  signinFailure,
  refreshTokensSuccess,
  refreshTokensFailure,
  logout,
} from "./signinSlice";
import { API } from "../../../services/apiBuilder";

export const signinUser = createAsyncThunk(
  "signin/signinUser",
  async (credentials, { dispatch }) => {
    dispatch(signinRequest());
    try {
      const response = await API.post("/auth/signin/", credentials);
      dispatch(signinSuccess(response.data));
    } catch (error) {
      dispatch(signinFailure(error.response?.data?.message));
    }
  },
);

export const refreshToken = createAsyncThunk(
  `signin/refreshToken`,
  async (token, { dispatch }) => {
    try {
      const response = await API.post("/auth/refreshtoken/", token);
      dispatch(refreshTokensSuccess(response.data));
    } catch (error) {
      dispatch(refreshTokensFailure(error.response?.data?.message));
    }
  },
);

export const signOutUser = createAsyncThunk(
  "signin/signOutUser",
  async (token, { dispatch }) => {
    try {
      const response = await API.post("/auth/signout/", token);
      dispatch(logout(response));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
);
