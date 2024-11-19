import axios from "axios";
import { store } from "../redux/store/store";
import {
  refreshToken,
  signOutUser,
} from "../redux/features/signin/signinThunk";

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to update the access token in local storage
const updateLocalAccessToken = (token) => {
  localStorage.setItem("accessToken", JSON.stringify(token));
};

API.interceptors.request.use(
  (config) => {
    if (JSON.parse(localStorage.getItem("accessToken"))) {
      config.headers["x-access-token"] = JSON.parse(
        localStorage.getItem("accessToken"),
      ); // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/api/auth/signin" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const { payload } = await store.dispatch(
            refreshToken({
              refreshToken: JSON.parse(localStorage.getItem("refreshToken")),
            }),
          );

          if (!payload) {
            updateLocalAccessToken(payload.accessToken);
            originalConfig.headers["x-access-token"] = payload.accessToken;
          }

          return API(originalConfig);
        } catch (_error) {
          await store.dispatch(
            signOutUser({
              refreshToken: JSON.parse(localStorage.getItem("refreshToken")),
            }),
          );
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  },
);

const apiBuilder = {
  API,
};
export default apiBuilder;
