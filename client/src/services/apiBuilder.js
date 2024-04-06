import axios from "axios";
import { store } from "../redux/store/store";
import {
  refreshToken,
  signOutUser,
} from "../redux/features/signin/signinThunk";

const baseURL = "http://localhost:3001"; // process.env.NEXT_PUBLIC_API_BASE_URL;

export const API = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    // "x-access-token": storedAccessToken,
  },
});

API.interceptors.request.use(
  (config) => {
    //   const token = storedAccessToken;
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
          await store.dispatch(
            refreshToken({
              refreshToken: JSON.parse(localStorage.getItem("refreshToken")),
            }),
          );

          //updateLocalAccessToken(data.accessToken);

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
