import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socialAuthIsLoading: false,
  socialAuth: null,
  socialAuthError: null,
  updateUserProfile: null,
  updateUserProfileError: null,
  updateUserProfileIsLoading: false,
  userDetails: null,
  userDetailsError: null,
  userDetailsIsLoading: false,
  userConcerns: null,
  userConcernsError: null,
  userConcernsIsLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    checkSocialAuthRequest: (state) => {
      state.socialAuthIsLoading = true;
      state.socialAuthError = null;
    },
    checkSocialAuthSuccess: (state, action) => {
      state.socialAuthIsLoading = false;
      state.socialAuth = action.payload;
    },
    checkSocialAuthFailure: (state, action) => {
      state.socialAuthIsLoading = false;
      state.socialAuthError = action.payload;
    },
    updateUserProfileRequest: (state) => {
      state.updateUserProfileIsLoading = true;
      state.updateUserProfileError = null;
    },
    updateUserProfileSuccess: (state, action) => {
      state.updateUserProfileIsLoading = false;
      state.updateUserProfile = action.payload;
    },
    updateUserProfileFailure: (state, action) => {
      state.updateUserProfileIsLoading = false;
      state.updateUserProfileError = action.payload;
    },
    userDetailsRequest: (state) => {
      state.userDetailsIsLoading = true;
      state.userDetailsError = null;
    },
    userDetailsSuccess: (state, action) => {
      state.userDetailsIsLoading = false;
      state.userDetails = action.payload;
    },
    userDetailsFailure: (state, action) => {
      state.userDetailsIsLoading = false;
      state.userDetailsError = action.payload;
    },
    userConcernsRequest: (state) => {
      state.userConcernsIsLoading = true;
      state.userConcernsError = null;
    },
    userConcernsSuccess: (state, action) => {
      state.userConcernsIsLoading = false;
      state.userConcerns = action.payload;
    },
    userConcernsFailure: (state, action) => {
      state.userConcernsIsLoading = false;
      state.userConcernsError = action.payload;
    },
  },
});

export const {
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
} = userSlice.actions;

export default userSlice.reducer;
