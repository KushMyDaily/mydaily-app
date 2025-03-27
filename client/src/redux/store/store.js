import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import signupReducer from "../features/signup/signupSlice";
import signinReducer from "../features/signin/signinSlice";
import userReducer from "../features/user/userSlice";
import googleReducer from "../features/google/googleSlice";
import statsDataReducer from "../features/statsData/statDataSlice";
import superUserReducer from "../features/superUser/superUserSlice";

const persistConfig = {
  key: "mydaily",
  storage,
  whitelist: ["signin"],
};

const rootReducer = combineReducers({
  signup: signupReducer,
  signin: signinReducer,
  user: userReducer,
  google: googleReducer,
  statsData: statsDataReducer,
  superUser: superUserReducer,
});

const persistAuthReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistAuthReducer,
});

export const persistedStore = persistStore(store);
