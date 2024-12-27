import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stressfactorsIsLoading: false,
  stressfactorsError: null,
  stressfactors: null,
  wellbeingIsLoading: false,
  wellbeingError: null,
  wellbeing: null,
  monthDataLoading: false,
  monthDataError: null,
  monthData: null,
  calendarLoading: false,
  calendarError: null,
  calendar: null,
  managerViewLoading: false,
  managerViewError: null,
  manager: null,
  subordinatesFormsLoading: false,
  subordinatesFormsError: null,
  subordinatesForms: null,
};

const statDataSlice = createSlice({
  name: "statData",
  initialState,
  reducers: {
    stressfactorsRequest: (state) => {
      state.stressfactorsIsLoading = true;
      state.error = null;
    },
    stressfactorsSuccess: (state, action) => {
      state.stressfactorsIsLoading = false;
      state.stressfactors = action.payload;
    },
    stressfactorsFailure: (state, action) => {
      state.stressfactorsIsLoading = false;
      state.stressfactorsError = action.payload;
    },
    wellbeingRequest: (state) => {
      state.wellbeingIsLoading = true;
      state.wellbeingError = null;
    },
    wellbeingSuccess: (state, action) => {
      state.wellbeingIsLoading = false;
      state.wellbeing = action.payload;
    },
    wellbeingFailure: (state, action) => {
      state.wellbeingIsLoading = false;
      state.wellbeingError = action.payload;
    },
    monthDataRequest: (state) => {
      state.monthDataLoading = true;
      state.monthDataError = null;
    },
    monthDataSuccess: (state, action) => {
      state.monthDataLoading = false;
      state.monthData = action.payload;
    },
    monthDataFailure: (state, action) => {
      state.monthDataLoading = false;
      state.monthDataError = action.payload;
    },
    calendarRequest: (state) => {
      state.calendarLoading = true;
      state.calendarError = null;
    },
    calendarSuccess: (state, action) => {
      state.calendarLoading = false;
      state.calendar = action.payload;
    },
    calendarFailure: (state, action) => {
      state.calendarLoading = false;
      state.calendarError = action.payload;
    },
    managerViewRequest: (state) => {
      state.managerViewLoading = true;
      state.managerViewError = null;
    },
    managerViewSuccess: (state, action) => {
      state.managerViewLoading = false;
      state.manager = action.payload;
    },
    managerViewFailure: (state, action) => {
      state.managerViewLoading = false;
      state.managerViewError = action.payload;
    },
    getSubordinatesformsRequest: (state) => {
      state.subordinatesFormsLoading = true;
      state.subordinatesFormsError = null;
    },
    getSubordinatesformsSuccess: (state, action) => {
      state.subordinatesFormsLoading = false;
      state.subordinatesForms = action.payload;
    },
    getSubordinatesformsFailure: (state, action) => {
      state.subordinatesFormsLoading = false;
      state.subordinatesFormsError = action.payload;
    },
  },
});

export const {
  stressfactorsRequest,
  stressfactorsSuccess,
  stressfactorsFailure,
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
  getSubordinatesformsRequest,
  getSubordinatesformsSuccess,
  getSubordinatesformsFailure,
} = statDataSlice.actions;

export default statDataSlice.reducer;
