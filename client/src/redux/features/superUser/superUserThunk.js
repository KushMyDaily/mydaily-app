import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../services/apiBuilder";
import {
  getAllCompanyRequest,
  getAllCompanySuccess,
  getAllCompanyFailure,
  getCompanyDetailsRequest,
  getCompanyDetailsSuccess,
  getCompanyDetailsFailure,
  surveyResponseRequest,
  surveyResponseSuccess,
  surveyResponseFailure,
} from "./superUserSlice"; // Adjust the path as needed

export const getCompanyData = createAsyncThunk(
  `stat/superUser/companyData`,
  async (_, { dispatch }) => {
    dispatch(getAllCompanyRequest());
    try {
      const response = await API.get("/api/superuser/getcompanylist");
      dispatch(getAllCompanySuccess(response.data));
    } catch (error) {
      dispatch(getAllCompanyFailure(error));
    }
  },
);

export const getCompanyDetails = createAsyncThunk(
  `stat/superUser/getCompanyDetails`,
  async (id, { dispatch }) => {
    dispatch(getCompanyDetailsRequest());
    try {
      const response = await API.get(`/api/superuser/getcompanydetails/${id}`);
      dispatch(getCompanyDetailsSuccess(response.data));
    } catch (error) {
      dispatch(getCompanyDetailsFailure(error));
    }
  },
);

export const getSurveyresponse = createAsyncThunk(
  `stat/superUser/surveyresponse`,
  async (data, { dispatch }) => {
    dispatch(surveyResponseRequest());
    try {
      const response = await API.post("/api/superuser/surveyresponse/", data);
      dispatch(surveyResponseSuccess(response.data));
    } catch (error) {
      dispatch(surveyResponseFailure(error));
    }
  },
);
export const clearAllStatus = createAsyncThunk(
  `stat/superUser/clearAllStatus`,
  async (_, { dispatch }) => {
    dispatch(getCompanyDetailsRequest());
    dispatch(surveyResponseRequest());
    try {
      dispatch(getCompanyDetailsSuccess(null));
      dispatch(surveyResponseSuccess(null));
    } catch (error) {
      dispatch(getCompanyDetailsFailure(null));
      dispatch(surveyResponseFailure(null));
    }
  },
);
