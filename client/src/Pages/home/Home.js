/* eslint-disable no-unused-vars */
import { Box, Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import moment from "moment";
import PageHeader from "../../comps/PageHeader";
import Color from "../../utils/Color";
import Chart from "react-apexcharts";
import Calendar from "react-calendar";
import {
  stressfactorStat,
  wellbeingStat,
  monthStat,
  calendaStat,
} from "../../redux/features/statsData/statDataThunk";
import { useDispatch, useSelector } from "react-redux";
import "react-calendar/dist/Calendar.css";

import Legends from "../../comps/Legends";
import CircularProgressCard from "../../comps/CircularProgressCard";
import ProgressBar from "./../../comps/ProgressBar";
import styles from "./home.module.css";
import { API } from "../../services/apiBuilder";

const OPTIONS = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    // show: false,
    labels: {
      color: "rbga(0,0,0,0.4)",
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    color: "black",
    decimalsInFloat: 0,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "18px",
        fontWeight: "500",
      },
    },
    min: 1,
    max: 10,
  },
  grid: {
    show: false,
  },
  colors: [
    function ({ value }) {
      if (value >= 9.5 && value <= 10) {
        return Color.Amazing;
      }
      if (value >= 7.5 && value <= 9.5) {
        return Color.Great;
      }
      if (value >= 5.5 && value <= 7.5) {
        return Color.Good;
      }
      if (value >= 3.5 && value <= 5.5) {
        return Color.Alright;
      }
      if (value >= 1.5 && value <= 3.5) {
        return Color.Low;
      }
      if (value >= 0 && value <= 1.5) {
        return Color.Exhausted;
      } else {
        return "#000000";
      }
    },
  ],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },

  plotOptions: {
    bar: {
      columnWidth: "25%",
      borderRadius: 5,
      distributed: true,
    },
  },
  responsive: [
    {
      breakpoint: 1280,
      options: {
        chart: {
          width: "100%",
          height: 280,
        },
      },
    },
    {
      breakpoint: 451,
      options: {
        chart: {
          width: "100%",
          height: 180,
        },
      },
    },
  ],
};

const inputDates = [
  { date: new Date("2023-08-8"), tooltip: "amazing" },
  { date: new Date("2023-08-9"), tooltip: "good" },
  { date: new Date("2023-08-10"), tooltip: "low" },
  { date: new Date("2023-08-11"), tooltip: "great" },
  { date: new Date("2023-08-14"), tooltip: "alright" },
  { date: new Date("2023-08-15"), tooltip: "good" },
  { date: new Date("2023-08-16"), tooltip: "exhausted" },
  { date: new Date("2023-08-17"), tooltip: "great" },
  { date: new Date("2023-08-18"), tooltip: "alright" },
  { date: new Date("2023-08-21"), tooltip: "amazing" },
  { date: new Date("2023-08-22"), tooltip: "low" },
  { date: new Date("2023-08-25"), tooltip: "great" },
  { date: new Date("2024-10-08"), tooltip: "great" },
];

function Home() {
  const [selectedAmazing, setSelectedAmazing] = useState([]);
  const [selectedGreat, setSelectedGreat] = useState([]);
  const [selectedGood, setSelectedGood] = useState([]);
  const [selectedAlright, setSelectedAlright] = useState([]);
  const [selectedLow, setSelectedLow] = useState([]);
  const [selectedExhausted, setSelectedExhausted] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // State to store the scores and averages
  const [wellBeingScore, setWellBeingScore] = useState(0);
  const [workloadScore, setWorkloadScore] = useState(0);
  const [autonomyScore, setAutonomyScore] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [relationshipsScore, setRelationshipsScore] = useState(0);
  const [timeBoundariesScore, setTimeBoundariesScore] = useState(0);
  const [monthlyAverages, setMonthlyAverages] = useState([]);
  const [formAverageLast30Days, setFormAverageLast30Days] = useState(0);
  const [formAverageAllData, setFormAverageAllData] = useState(0);
  const [stressFactorAverageLast30Days, setStressFactorAverageLast30Days] =
    useState(0);
  const [stressFactorAverageAllData, setStressFactorAverageAllData] =
    useState(0);
  const [calendarDates, setCalendarDates] = useState([]);

  const { user } = useSelector((state) => state.signin);
  const {
    stressfactorsIsLoading,
    stressfactorsError,
    stressfactors,
    wellbeingIsLoading,
    wellbeingError,
    wellbeing,
    monthDataLoading,
    monthDataError,
    monthData,
    calendarLoading,
    calendarError,
    calendar,
  } = useSelector((state) => state.statsData);
  const dispatch = useDispatch();

  // test restricting the calendar
  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  useEffect(() => {
    const date = new Date();
    let thisYear = date.getFullYear();
    dispatch(
      stressfactorStat({
        userId: user.id,
        date: getPreviousWeekday(new Date()),
      }),
    );
    dispatch(
      wellbeingStat({
        userId: user.id,
        date: getPreviousWeekday(new Date()),
      }),
    );
    dispatch(
      monthStat({
        userId: user.id,
        year: thisYear,
      }),
    );
    dispatch(
      calendaStat({
        userId: user.id,
        year: thisYear,
      }),
    );
  }, []);

  useEffect(() => {
    if (stressfactors && stressfactors.data) {
      setWorkloadScore(stressfactors.data?.workload || 0);
      setRelationshipsScore(stressfactors.data?.relationship || 0);
      setTimeBoundariesScore(stressfactors.data?.timeBoundaries || 0);
      setAutonomyScore(stressfactors.data?.autonomy || 0);
      setCommunicationScore(stressfactors.data?.communication || 0);
    }
  }, [stressfactors]);

  useEffect(() => {
    if (wellbeing && wellbeing.data) {
      setWellBeingScore(wellbeing.data?.yourForm);
      setFormAverageLast30Days(wellbeing.data?.formAverageLast30Days);
      setFormAverageAllData(wellbeing.data?.formAverageAllData);
      setStressFactorAverageLast30Days(
        wellbeing.data?.stressFactorAverageLast30Days,
      );
      setStressFactorAverageAllData(wellbeing.data?.stressFactorAverageAllData);
    }
  }, [wellbeing]);

  useEffect(() => {
    if (monthData && monthData.data) {
      const charSeriesData = monthData.data.map((month) => {
        return month.yourForm;
      });

      setMonthlyAverages([{ data: charSeriesData }]);
    }
  }, [monthData]);

  useEffect(() => {
    if (calendar && calendar.data) {
      const calendarData = calendar.data.map((date) => {
        // Extract date and format it as YYYY-MM-DD
        const dateOnly = date?.createdAt;
        const [year, month, day] = dateOnly.split("-").map(Number); // Split and convert to numbers
        const dateObject = new Date(year, month - 1, day);

        // Get the tooltip based on your custom logic (assuming defineClass function)
        const tooltip = defineClass(date?.yourForm);

        // Return the object with date and tooltip in the desired format
        return {
          date: dateObject, // Ensures it's a Date object in UTC
          tooltip: tooltip,
        };
      });
      setCalendarDates(calendarData);
    }
  }, [calendar]);

  useEffect(() => {
    const filterAmazingDate = calendarDates?.filter(
      (item) => item.tooltip == "amazing",
    );
    const AmazingDates = filterAmazingDate?.map((dateStr) => {
      const date = new Date(dateStr.date);
      return `${date.getDate().toString().padStart(1, "0")}-${(date.getMonth() + 1).toString().padStart(1, "0")}-${date.getFullYear()}`;
    });
    setSelectedAmazing(AmazingDates);

    const filterGreatDate = calendarDates?.filter(
      (item) => item.tooltip == "great",
    );
    const GreatDates = filterGreatDate?.map((dateStr) => {
      const date = new Date(dateStr.date);
      return `${date.getDate().toString().padStart(1, "0")}-${(date.getMonth() + 1).toString().padStart(1, "0")}-${date.getFullYear()}`;
    });
    setSelectedGreat(GreatDates);

    const filterGoodDate = calendarDates?.filter(
      (item) => item.tooltip == "good",
    );
    const goodDates = filterGoodDate?.map((dateStr) => {
      const date = new Date(dateStr.date);
      return `${date.getDate().toString().padStart(1, "0")}-${(date.getMonth() + 1).toString().padStart(1, "0")}-${date.getFullYear()}`;
    });
    setSelectedGood(goodDates);

    const filterAlrightDate = calendarDates?.filter(
      (item) => item.tooltip == "alright",
    );
    const AlrightDates = filterAlrightDate?.map((dateStr) => {
      const date = new Date(dateStr.date);
      return `${date.getDate().toString().padStart(1, "0")}-${(date.getMonth() + 1).toString().padStart(1, "0")}-${date.getFullYear()}`;
    });
    setSelectedAlright(AlrightDates);

    const filterLowDate = calendarDates?.filter(
      (item) => item.tooltip == "low",
    );
    const LowDates = filterLowDate?.map((dateStr) => {
      const date = new Date(dateStr.date);
      return `${date.getDate().toString().padStart(1, "0")}-${(date.getMonth() + 1).toString().padStart(1, "0")}-${date.getFullYear()}`;
    });
    setSelectedLow(LowDates);

    const filterExhaustedDate = calendarDates?.filter(
      (item) => item.tooltip == "exhausted",
    );
    const ExhaustedDates = filterExhaustedDate?.map((dateStr) => {
      const date = new Date(dateStr.date);
      return `${date.getDate().toString().padStart(1, "0")}-${(date.getMonth() + 1).toString().padStart(1, "0")}-${date.getFullYear()}`;
    });
    setSelectedExhausted(ExhaustedDates);
  }, [calendarDates]);

  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    // Remember that months in JavaScript start from 0 (January) to 11 (December).
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Function to get the last weekday from a given date
  function getPreviousWeekday(date) {
    let previousDate = moment(date).subtract(1, "days");

    // If the day is Saturday (6) or Sunday (0), adjust to the last weekday (Friday)
    if (previousDate.day() === 6) {
      // If it's Saturday, subtract 1 more day to get Friday
      previousDate = previousDate.subtract(1, "days");
    } else if (previousDate.day() === 0) {
      // If it's Sunday, subtract 2 more days to get Friday
      previousDate = previousDate.subtract(2, "days");
    }

    return previousDate.format("YYYY-MM-DD");
  }

  // Function to customize day cell content with tooltips
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const matchDate = calendarDates.find(
        (item) => item.date.toDateString() === date.toDateString(),
      );

      if (matchDate) {
        return (
          <div className="tooltip-wrapper">
            <span className="tooltip">{matchDate.tooltip}</span>
          </div>
        );
      }
    }
    return null;
  };

  const getTileClassName = (date) => {
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    if (selectedAmazing?.includes(formattedDate)) {
      return "amazing-day";
    }

    if (selectedGreat?.includes(formattedDate)) {
      return "great-day";
    }

    if (selectedGood?.includes(formattedDate)) {
      return "good-day";
    }

    if (selectedAlright?.includes(formattedDate)) {
      return "alright-day";
    }

    if (selectedLow?.includes(formattedDate)) {
      return "low-day";
    }

    if (selectedExhausted?.includes(formattedDate)) {
      return "exhausted-day";
    }

    return "";
  };

  // All the queries for the scores
  //  const FETCH_WELLBEING_SCORE = `
  //   query ListScoresForSpecificUserAndDate($filter: ModelWellBeingScoreFilterInput!) {
  //       listWellBeingScores(filter: $filter) {
  //         items {
  //           wellbeingScore
  //         }
  //       }
  //     }
  //   `;

  //   const FETCH_WORKLOAD_SCORE = `
  //   query ListScoresForSpecificUserAndDate($filter: ModelWorkloadScoreFilterInput!) {
  //       listWorkloadScores(filter: $filter) {
  //         items {
  //           workloadScore
  //         }
  //       }
  //     }
  //   `;

  //   const FETCH_AUTONOMY_SCORE = `
  //   query ListScoresForSpecificUserAndDate($filter: ModelAutonomyScoreFilterInput!) {
  //       listAutonomyScores(filter: $filter) {
  //         items {
  //           workloadScore
  //         }
  //       }
  //     }
  //   `;

  //   const FETCH_COMMUNICATION_SCORE = `
  //   query ListScoresForSpecificUserAndDate($filter: ModelCommunicationScoreFilterInput!) {
  //       listCommunicationScores(filter: $filter) {
  //         items {
  //           workloadScore
  //         }
  //       }
  //     }
  //   `;

  //   const FETCH_RELATIONSHIPS_SCORE = `
  //   query ListScoresForSpecificUserAndDate($filter: ModelRelationshipsScoreFilterInput!) {
  //       listRelationshipsScores(filter: $filter) {
  //         items {
  //           workloadScore
  //         }
  //       }
  //     }
  //   `;

  //   const FETCH_TIMEBOUNDARIES_SCORE = `
  //   query ListScoresForSpecificUserAndDate($filter: ModelTimeBoundariesScoreFilterInput!) {
  //       listTimeBoundariesScores(filter: $filter) {
  //         items {
  //           workloadScore
  //         }
  //       }
  //     }
  //   `;

  //   const FETCH_WELLBEING_SCORES_BY_DATE_RANGE = `
  //   query FetchWellbeingScoresByDateRange($filter: ModelWellBeingScoreFilterInput) {
  //     listWellBeingScores(filter: $filter) {
  //       items {
  //         wellbeingScore
  //         createdDate
  //       }
  //     }
  //   }
  // `;

  //   // UseEffect for all the Scores
  //   useEffect(() => {

  //     // Get the current user's email
  //     const fetchUserEmail = async () => {
  //       try {
  //         const user = await Auth.currentAuthenticatedUser();
  //         const userEmail = user.attributes.email;
  //         //console.log("User email:", userEmail);
  //         return userEmail;
  //       } catch (error) {
  //         console.error("Error fetching user:", error);
  //       }
  //     };

  //     // Get yesterday's date in YYYY-MM-DD format
  //     const getYesterdayDateString = () => {
  //       const today = new Date();
  //       const yesterday = new Date(today.setDate(today.getDate() - 1));
  //       const dd = String(yesterday.getDate()).padStart(2, '0');
  //       const mm = String(yesterday.getMonth() + 1).padStart(2, '0'); // January is 0!
  //       const yyyy = yesterday.getFullYear();
  //       return `${yyyy}-${mm}-${dd}`;
  //     }

  //     // Fetch the WellBeing score
  //     const fetchWellBeingScore = async () => {
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: getYesterdayDateString() }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_WELLBEING_SCORE, { filter: filter }));
  //         //console.log("Well-being score:", result);
  //         if (result.data.listWellBeingScores.items && result.data.listWellBeingScores.items.length > 0) {
  //           setWellBeingScore(parseFloat(result.data.listWellBeingScores.items[0].wellbeingScore).toFixed(1));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching well-being score:", error);
  //       }
  //     };

  //     // Fetch the WellBeing score
  //     const fetchWellBeingScorePerDate = async (date) => {
  //       console.log("date 1", date)
  //       date = formatDate(date);
  //       console.log("date 1", date)
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: date }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_WELLBEING_SCORE, { filter: filter }));
  //         //console.log("Well-being score:", result);
  //         if (result.data.listWellBeingScores.items && result.data.listWellBeingScores.items.length > 0) {
  //           if (parseFloat(result.data.listWellBeingScores.items[0].wellbeingScore).toFixed(1) > 5) {
  //             return {date: date, tooltip: "amazing"};
  //           } else if (parseFloat(result.data.listWellBeingScores.items[0].wellbeingScore).toFixed(1) > 4) {
  //             return {date: date, tooltip: "great"};
  //           } else if (parseFloat(result.data.listWellBeingScores.items[0].wellbeingScore).toFixed(1) > 3) {
  //             return {date: date, tooltip: "good"};
  //           } // and more ...
  //         }
  //       } catch (error) {
  //         console.error("Error fetching well-being score:", error);
  //       }
  //     };

  //     const fetchWorkloadScore = async () => {
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: getYesterdayDateString() }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_WORKLOAD_SCORE, { filter: filter }));
  //         //console.log("Workload score:", result);
  //         if (result.data.listWorkloadScores.items && result.data.listWorkloadScores.items.length > 0) {
  //           setWorkloadScore(parseFloat(result.data.listWorkloadScores.items[0].workloadScore).toFixed(1));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching workload score:", error);
  //       }
  //     };

  //     const fetchAutonomyScore = async () => {
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: getYesterdayDateString() }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_AUTONOMY_SCORE, { filter: filter }));
  //         //console.log("Autonomy score:", result);
  //         if (result.data.listAutonomyScores.items && result.data.listAutonomyScores.items.length > 0) {
  //           setAutonomyScore(parseFloat(result.data.listAutonomyScores.items[0].workloadScore).toFixed(1));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching autonomy score:", error);
  //       }
  //     }

  //     const fetchCommunicationScore = async () => {
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: getYesterdayDateString() }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_COMMUNICATION_SCORE, { filter: filter }));
  //         //console.log("Communication score:", result);
  //         if (result.data.listCommunicationScores.items && result.data.listCommunicationScores.items.length > 0) {
  //           setCommunicationScore(parseFloat(result.data.listCommunicationScores.items[0].workloadScore).toFixed(1));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching communication score:", error);
  //       }
  //     }

  //     const fetchRelationshipsScore = async () => {
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: getYesterdayDateString() }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_RELATIONSHIPS_SCORE, { filter: filter }));
  //         //console.log("Relationships score:", result);
  //         if (result.data.listRelationshipsScores.items && result.data.listRelationshipsScores.items.length > 0) {
  //           setRelationshipsScore(parseFloat(result.data.listRelationshipsScores.items[0].workloadScore).toFixed(1));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching relationships score:", error);
  //       }
  //     }

  //     const fetchTimeBoundariesScore = async () => {
  //       try {
  //         const userEmail = await fetchUserEmail();
  //         const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { eq: getYesterdayDateString() }
  //         };
  //         const result = await API.graphql(graphqlOperation(FETCH_TIMEBOUNDARIES_SCORE, { filter: filter }));
  //         //console.log("Time boundaries score:", result);
  //         if (result.data.listTimeBoundariesScores.items && result.data.listTimeBoundariesScores.items.length > 0) {
  //           setTimeBoundariesScore(parseFloat(result.data.listTimeBoundariesScores.items[0].workloadScore).toFixed(1));
  //         }
  //       } catch (error) {
  //         console.error("Error fetching time boundaries score:", error);
  //       }
  //     }

  //     fetchWellBeingScore();
  //     fetchWorkloadScore();
  //     fetchAutonomyScore();
  //     fetchCommunicationScore();
  //     fetchRelationshipsScore();
  //     fetchTimeBoundariesScore();

  //     // ... (other existing code)
  //   }, []);

  // Needs to be rewrote
  // async function fetchAverageWellbeingScoresForYear(userEmail) {
  //   let monthlyAverages = [];

  //   for(let month = 1; month <= 12; month++) {
  //       let adjustedMonth = month < 10 ? `0${month}` : `${month}`;
  //       let currentYearString = new Date().getFullYear().toString();
  //       const startDate = `${currentYearString}-${adjustedMonth}-01`;
  //       const endDate = `${currentYearString}-${adjustedMonth}-31`;

  //       const filter = {
  //           userEmail: { eq: userEmail },
  //           createdDate: { between: [startDate, endDate] }
  //       };

  //       const result = await API.graphql(graphqlOperation(FETCH_WELLBEING_SCORES_BY_DATE_RANGE, { filter: filter }));

  //       let sum = 0;
  //       const items = result.data.listWellBeingScores.items;
  //       items.forEach(item => {
  //           sum += item.wellbeingScore;
  //       });

  //       if(items.length === 0) {
  //           monthlyAverages.push(0);
  //       } else {
  //           monthlyAverages.push(sum / items.length);
  //       }
  //   }
  //   return [{data: monthlyAverages}];
  // }

  // async function fetchAverageWellbeingScores(userEmail) {
  //   // Get current date
  //   const currentDate = new Date();

  //   // Calculate date 30 days ago
  //   const thirtyDaysAgo = new Date(currentDate);
  //   thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  //   // Fetch wellbeingScores for the last 30 days
  //   let filterForLast30Days = {
  //       userEmail: { eq: userEmail },
  //       createdDate: { between: [thirtyDaysAgo.toISOString().split('T')[0], currentDate.toISOString().split('T')[0]] }
  //   };
  //   const resultLast30Days = await API.graphql(graphqlOperation(FETCH_WELLBEING_SCORES_BY_DATE_RANGE, { filter: filterForLast30Days }));
  //   const itemsLast30Days = resultLast30Days.data.listWellBeingScores.items;
  //   const averageLast30Days = itemsLast30Days.reduce((acc, item) => acc + item.wellbeingScore, 0) / itemsLast30Days.length;

  //   // Fetch all wellbeingScores
  //   let filterForAllTime = {
  //       userEmail: { eq: userEmail }
  //   };
  //   const resultAllTime = await API.graphql(graphqlOperation(FETCH_WELLBEING_SCORES_BY_DATE_RANGE, { filter: filterForAllTime }));
  //   const itemsAllTime = resultAllTime.data.listWellBeingScores.items;
  //   const averageAllTime = itemsAllTime.reduce((acc, item) => acc + item.wellbeingScore, 0) / itemsAllTime.length;

  //   return {
  //       last30DaysAverage: parseFloat(averageLast30Days).toFixed(1),
  //       allTimeAverage: parseFloat(averageAllTime).toFixed(1)
  //   };
  // }

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const user = await Auth.currentAuthenticatedUser();
  //       const userEmail = user.attributes.email;
  //       //const averages = await fetchAverageWellbeingScoresForYear(userEmail);
  //       //setMonthlyAverages(averages);
  //       // const averages30All = await fetchAverageWellbeingScores(userEmail);
  //       // const last30DaysAverage = averages30All.last30DaysAverage;
  //       // const allTimeAverage = averages30All.allTimeAverage;
  //       // setLast30DaysAverage(last30DaysAverage);
  //       // setAllTimeAverage(allTimeAverage);
  //     } catch (error) {
  //       console.error("Error fetching monthly averages:", error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // Handle when the user navigates to a different month in the calendar
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
    //console.log(activeStartDate);
  };

  const onClickHandler = async () => {
    let storedAccessToken = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await API.get("/api/test/all", {
        headers: { "x-access-token": storedAccessToken },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const defineColor = (score) => {
    switch (true) {
      case score >= 9.5 && score <= 10:
        return Color.Amazing;
      case score >= 7.5 && score < 9.5:
        return Color.Great;
      case score >= 5.5 && score < 7.5:
        return Color.Good;
      case score >= 3.5 && score < 5.5:
        return Color.Alright;
      case score >= 1.5 && score < 3.5:
        return Color.Low;
      case score >= 0 && score < 1.5:
        return Color.Exhausted;
      default:
        return "#000000"; // Handle cases outside defined ranges
    }
  };

  const defineBGColor = (score) => {
    switch (true) {
      case score >= 9.5 && score <= 10:
        return Color.AmazingBg;
      case score >= 7.5 && score < 9.5:
        return Color.GreatBg;
      case score >= 5.5 && score < 7.5:
        return Color.GoodBg;
      case score >= 3.5 && score < 5.5:
        return Color.AlrightBg;
      case score >= 1.5 && score < 3.5:
        return Color.LowBg;
      case score >= 0 && score < 1.5:
        return Color.ExhaustedBg;
      default:
        return "#000000"; // Handle cases outside defined ranges
    }
  };

  const defineClass = (score) => {
    switch (true) {
      case score >= 9.5 && score <= 10:
        return "amazing";
      case score >= 7.5 && score < 9.5:
        return "great";
      case score >= 5.5 && score < 7.5:
        return "good";
      case score >= 3.5 && score < 5.5:
        return "alright";
      case score >= 1.5 && score < 3.5:
        return "low";
      case score >= 0 && score < 1.5:
        return "exhausted";
      default:
        return ""; // Handle cases outside defined ranges
    }
  };

  return (
    <Box>
      <PageHeader
        title="Your Dashboard"
        subTitle="Friday 6h of March"
        filterOption={false}
        toolTipContent="Welcome to MyDaily! <br/><br/> We want to empower you to take charge of your well-being. That's why we've created a system that combines your own self-assessment with the insights of our AI technology.<br/><br/> Your rating is shared only with your direct manager to make sure you're both on the same page and can prioritize your well-being. But don't worry, the reasons behind your score are strictly private and only for your own self-reflection. You can choose to discuss them or not.<br/><br/> Our AI technology analyzes trends and patterns to provide personalized nudges and suggestions to help you improve your overall well-being. We believe that small changes can lead to big improvements, and we're here to support you every step of the way."
      />
      <button onClick={onClickHandler}>Click me</button>
      <Legends />
      <Flex className={styles.chartRow}>
        <Box className={styles.chartCol}>
          <Flex className={styles.chartRowInner}>
            <Box className={styles.chartColInner}>
              <CircularProgressCard
                heading="Your Form"
                percentage={wellBeingScore}
                increase={true}
                statusText="Increase since last week"
                color={defineColor(wellBeingScore)}
                bgColor={defineBGColor(wellBeingScore)}
              />
            </Box>
            <Box className={styles.chartColInner}>
              <Card className={styles.DetailCard}>
                <CardHeader p={0}>
                  <Text
                    fontSize={"22px"}
                    fontWeight={"500"}
                    lineHeight={"30px"}
                    marginBottom={1}
                  >
                    Details
                  </Text>
                </CardHeader>
                <CardBody p={0}>
                  <Text
                    fontSize={"14px"}
                    lineHeight={"20px"}
                    marginBottom={2.5}
                    color={"#000000"}
                    opacity={"0.4"}
                  >
                    Your form score
                  </Text>
                  <Box mb={5}>
                    <ProgressBar
                      heading="Last 30 days"
                      rating={formAverageLast30Days}
                      textColor={defineColor(formAverageLast30Days)}
                      progressColor={defineClass(formAverageLast30Days)}
                    />
                  </Box>
                  <Box mb={5}>
                    <ProgressBar
                      heading="All time"
                      rating={formAverageAllData}
                      textColor={defineColor(formAverageAllData)}
                      progressColor={defineClass(formAverageAllData)}
                    />
                  </Box>
                  <Text
                    fontSize={"14px"}
                    lineHeight={"20px"}
                    marginTop={1}
                    marginBottom={3}
                    color={"#000000"}
                    opacity={"0.4"}
                  >
                    Your wellbeing reason
                  </Text>
                  <Box mb={5}>
                    <ProgressBar
                      heading="Last 30 days"
                      rating={stressFactorAverageLast30Days}
                      textColor={defineColor(stressFactorAverageLast30Days)}
                      progressColor={defineClass(stressFactorAverageLast30Days)}
                    />
                  </Box>
                  <Box>
                    <ProgressBar
                      heading="All time"
                      rating={stressFactorAverageAllData}
                      textColor={defineColor(stressFactorAverageAllData)}
                      progressColor={defineClass(stressFactorAverageAllData)}
                    />
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Flex>
          <Box>
            <Card boxShadow={"none"}>
              <CardBody padding={"25px 15px 30px"}>
                <Legends />
                <Box className="ChartBox">
                  <Chart
                    options={OPTIONS}
                    series={monthlyAverages}
                    type="bar"
                    width="100%"
                    height={269}
                  />
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Box>

        <Box className={styles.chartCol}>
          <Card boxShadow={"none"} className={styles.calenderCard}>
            <CardBody p={0} className={styles.calenderCardInner}>
              <Box className="calenderWrap">
                <Calendar
                  //value={inputDates}
                  tileContent={tileContent}
                  tileClassName={({ date }) => getTileClassName(date)}
                />
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Flex>
      <Box>
        <Text
          fontSize={"22px"}
          fontWeight={"500"}
          lineHeight={"30px"}
          marginBottom={6}
        >
          Your wellbeing factors
        </Text>
        <Flex className={styles.factorRow}>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Workload"
              percentage={workloadScore}
              increase={true}
              statusText="Decrease since last week"
              color={defineColor(workloadScore)}
              bgColor={defineBGColor(workloadScore)}
            />
          </Box>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Relationships"
              percentage={relationshipsScore}
              increase={false}
              statusText="Decrease since last week"
              color={defineColor(relationshipsScore)}
              bgColor={defineBGColor(relationshipsScore)}
            />
          </Box>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Time Boundaries"
              percentage={timeBoundariesScore}
              increase={false}
              statusText="Decrease since last week"
              color={defineColor(timeBoundariesScore)}
              bgColor={defineBGColor(timeBoundariesScore)}
            />
          </Box>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Sense of autonomy"
              percentage={autonomyScore}
              increase={true}
              statusText="Increase since last week"
              color={defineColor(autonomyScore)}
              bgColor={defineBGColor(autonomyScore)}
            />
          </Box>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Communication"
              percentage={communicationScore}
              increase={true}
              statusText="Increase since last week"
              color={defineColor(communicationScore)}
              bgColor={defineBGColor(communicationScore)}
            />
          </Box>
        </Flex>
      </Box>
      {/* <WellbeingReasons /> */}
    </Box>
  );
}

export default Home;
