import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define your initial state here
  companyData: null,
  companyDataLoading: false,
  companyDataError: null,
  companyDetails: null,
  companyDetailsLoading: false,
  companyDetailsError: null,
  surveyResponse: null,
  surveyResponseLoading: false,
  surveyResponseError: null,
};

const superUserSlice = createSlice({
  name: "superUser",
  initialState,
  reducers: {
    // Define your reducers here
    getAllCompanyRequest(state) {
      state.companyDataLoading = true;
      state.companyDataError = null;
    },
    getAllCompanySuccess(state, action) {
      state.companyDataLoading = false;
      state.companyData = action.payload;
    },
    getAllCompanyFailure(state, action) {
      state.companyDataLoading = false;
      state.companyDataError = action.payload;
    },
    getCompanyDetailsRequest(state) {
      state.companyDetailsLoading = true;
      state.companyDetailsError = null;
    },
    getCompanyDetailsSuccess(state, action) {
      state.companyDetailsLoading = false;
      state.companyDetails = action.payload;
    },
    getCompanyDetailsFailure(state, action) {
      state.companyDetailsLoading = false;
      state.companyDetailsError = action.payload;
    },
    surveyResponseRequest(state) {
      state.surveyResponseLoading = true;
      state.surveyResponseError = null;
    },
    surveyResponseSuccess(state, action) {
      state.surveyResponseLoading = false;
      state.surveyResponse = action.payload;
    },
    surveyResponseFailure(state, action) {
      state.surveyResponseLoading = false;
      state.surveyResponseError = action.payload;
    },
  },
});

export const {
  getAllCompanyRequest,
  getAllCompanySuccess,
  getAllCompanyFailure,
  getCompanyDetailsRequest,
  getCompanyDetailsSuccess,
  getCompanyDetailsFailure,
  surveyResponseRequest,
  surveyResponseSuccess,
  surveyResponseFailure,
} = superUserSlice.actions;

export default superUserSlice.reducer;
