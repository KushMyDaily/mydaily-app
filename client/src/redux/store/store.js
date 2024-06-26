import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "../features/signup/signupSlice";
import signinReducer from "../features/signin/signinSlice";
import googleReducer from "../features/google/googleSlice";

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    signin: signinReducer,
    google: googleReducer,
  },
});
