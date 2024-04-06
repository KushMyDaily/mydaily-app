import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "../features/signup/signupSlice";
import signinReducer from "../features/signin/signinSlice";

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    signin: signinReducer,
  },
});
