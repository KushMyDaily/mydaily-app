import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  stressfactorsSuccess,
  stressfactorsFailure,
  stressfactorsRequest,
  wellbeingRequest,
  wellbeingSuccess,
  wellbeingFailure,
  monthDataRequest,
  monthDataSuccess,
  monthDataFailure,
  calendarRequest,
  calendarSuccess,
  calendarFailure,
  managerViewRequest,
  managerViewSuccess,
  managerViewFailure,
  getSubordinatesformsSuccess,
  getSubordinatesformsFailure,
  getSubordinatesformsRequest,
} from "./statDataSlice";
import { API } from "../../../services/apiBuilder";

export const stressfactorStat = createAsyncThunk(
  `stat/stressfactors/graph`,
  async (data, { dispatch }) => {
    dispatch(stressfactorsRequest());
    try {
      const response = await API.post("/api/stat/stressfactors/graph/", data);
      dispatch(stressfactorsSuccess(response.data));
    } catch (error) {
      dispatch(stressfactorsFailure(error));
    }
  },
);

export const wellbeingStat = createAsyncThunk(
  `stat/wellbeing/graph`,
  async (data, { dispatch }) => {
    dispatch(wellbeingRequest());
    try {
      const response = await API.post("/api/stat/wellbeing/graph/", data);
      dispatch(wellbeingSuccess(response.data));
    } catch (error) {
      dispatch(wellbeingFailure(error));
    }
  },
);

export const monthStat = createAsyncThunk(
  `stat/monthStat/graph`,
  async (data, { dispatch }) => {
    dispatch(monthDataRequest());
    try {
      const response = await API.post("/api/stat/month/graph/", data);
      dispatch(monthDataSuccess(response.data));
    } catch (error) {
      dispatch(monthDataFailure(error));
    }
  },
);

export const calendaStat = createAsyncThunk(
  `stat/monthStat/graph`,
  async (data, { dispatch }) => {
    dispatch(calendarRequest());
    try {
      const response = await API.post("/api/stat/calender/graph/", data);
      dispatch(calendarSuccess(response.data));
    } catch (error) {
      dispatch(calendarFailure(error));
    }
  },
);

export const managerViewStat = createAsyncThunk(
  `stat/managerViewStat/graph`,
  async (data, { dispatch }) => {
    dispatch(managerViewRequest());
    try {
      const response = await API.post(
        "/api/stat/manager/teamforms/graph/",
        data,
      );
      dispatch(managerViewSuccess(response.data));
    } catch (error) {
      dispatch(managerViewFailure(error));
    }
  },
);

export const getSubordinatesforms = createAsyncThunk(
  `stat/getSubordinatesforms/graph`,
  async (data, { dispatch }) => {
    dispatch(getSubordinatesformsRequest());
    try {
      const response = await API.post(
        "/api/stat/manager/subordinatesforms/graph/",
        data,
      );
      dispatch(getSubordinatesformsSuccess(response.data));
    } catch (error) {
      dispatch(getSubordinatesformsFailure(error));
    }
  },
);
