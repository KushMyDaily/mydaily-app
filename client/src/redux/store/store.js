import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import signupReducer from "../features/signup/signupSlice";
import signinReducer from "../features/signin/signinSlice";
import googleReducer from "../features/google/googleSlice";
import statsDataReducer from "../features/statsData/statDataSlice";

const persistConfig = {
  key: "mydaily",
  storage,
  blacklist: ["google", "statsData"],
};

const rootReducer = combineReducers({
  signup: signupReducer,
  signin: signinReducer,
  google: googleReducer,
  statsData: statsDataReducer,
});

const persistAuthReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistAuthReducer,
});

export const persistedStore = persistStore(store);
