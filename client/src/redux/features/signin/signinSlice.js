import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  user: null,
  isLoadingResetPassword: false,
  resettedPassword: null,
  errorResetPassword: null,
};

const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    signinRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signinSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.userRole = action.payload.roles;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem(
        "accessToken",
        JSON.stringify(action.payload.accessToken),
      );
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(action.payload.refreshToken),
      );
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      state.isAuthenticated = true;
    },
    signinFailure: (state, action) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.userRole = null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.user = null;
      state.userRole = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      state.isAuthenticated = false;
    },
    refreshTokensSuccess: (state, action) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(
        "accessToken",
        JSON.stringify(action.payload.accessToken),
      );
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(action.payload.refreshToken),
      );
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      state.isAuthenticated = true;
    },
    refreshTokensFailure: (state) => {
      state.isLoading = false;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      state.isAuthenticated = false;
    },
    clearResetPassword: (state) => {
      state.isLoadingResetPassword = false;
      state.resettedPassword = null;
      state.errorResetPassword = null;
    },
    resetPasswordRequest: (state) => {
      state.isLoadingResetPassword = true;
      state.resettedPassword = null;
      state.errorResetPassword = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.isLoadingResetPassword = false;
      state.resettedPassword = action.payload;
      state.errorResetPassword = null;
    },
    resetPasswordFailure: (state, action) => {
      state.isLoadingResetPassword = false;
      state.resettedPassword = null;
      state.errorResetPassword = action.payload;
    },
  },
});

export const {
  signinRequest,
  signinSuccess,
  signinFailure,
  logout,
  refreshTokensSuccess,
  refreshTokensFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearResetPassword,
} = signinSlice.actions;

export default signinSlice.reducer;
