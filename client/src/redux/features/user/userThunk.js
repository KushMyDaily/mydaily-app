import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkSocialAuthRequest,
  checkSocialAuthSuccess,
  checkSocialAuthFailure,
  updateUserProfileRequest,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFailure,
  userConcernsRequest,
  userConcernsSuccess,
  userConcernsFailure,
} from "./userSlice";
import { API } from "../../../services/apiBuilder";

export const checkSocialAuth = createAsyncThunk(
  "user/checkSocialAuth",
  async (userId, { dispatch }) => {
    dispatch(checkSocialAuthRequest());
    try {
      const response = await API.get(`/api/checksocialauth/${userId}`);
      dispatch(checkSocialAuthSuccess(response.data.data));
    } catch (error) {
      dispatch(checkSocialAuthFailure(error.response?.data?.message));
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { dispatch }) => {
    dispatch(updateUserProfileRequest());
    try {
      const response = await API.post(`/api/updateprofile`, userData);
      dispatch(updateUserProfileSuccess(response.data.data));
    } catch (error) {
      dispatch(updateUserProfileFailure(error.response?.data?.message));
    }
  },
);

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (userId, { dispatch }) => {
    dispatch(userDetailsRequest());
    try {
      const response = await API.get(`/api/getprofile/${userId}`);

      dispatch(userDetailsSuccess(response.data.data));
    } catch (error) {
      dispatch(userDetailsFailure(error.response?.data?.message));
    }
  },
);

export const sendConcern = createAsyncThunk(
  "user/sendConcern",
  async (data, { dispatch }) => {
    dispatch(userConcernsRequest());
    try {
      const response = await API.post(`/api/sendconcern/`, data);
      dispatch(userConcernsSuccess(response.data.data));
    } catch (error) {
      dispatch(userConcernsFailure(error.response?.data?.message));
    }
  },
);
