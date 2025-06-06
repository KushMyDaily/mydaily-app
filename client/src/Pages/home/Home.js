/* eslint-disable no-unused-vars */
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
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
  getWellBeingFactorOvertime,
} from "../../redux/features/statsData/statDataThunk";
import { useDispatch, useSelector } from "react-redux";
import "react-calendar/dist/Calendar.css";

import Legends from "../../comps/Legends";
import CircularProgressCard from "../../comps/CircularProgressCard";
import ProgressBar from "./../../comps/ProgressBar";
import styles from "./home.module.css";
import { API } from "../../services/apiBuilder";
import ZoomableChart from "../../comps/Charts/ZoomableChart/ZoomableChart";

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
      if (value >= 9 && value <= 10) {
        return Color.Amazing;
      }
      if (value >= 7.5 && value < 9) {
        return Color.Great;
      }
      if (value >= 6 && value < 7.5) {
        return Color.Good;
      }
      if (value >= 4 && value < 6) {
        return Color.Alright;
      }
      if (value >= 2 && value < 4) {
        return Color.Low;
      }
      if (value >= 0 && value < 2) {
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

const factorTableField = {
  Workload: "workload",
  Relationship: "relationship",
  TimeBoundaries: "timeBoundaries",
  Autonomy: "autonomy",
  Communication: "communication",
};

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
    wellBeingFactorOvertime,
  } = useSelector((state) => state.statsData);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState(null);

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

  // Handle when the user navigates to a different month in the calendar
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
    //console.log(activeStartDate);
  };

  const onClickHandler = async () => {
    let storedAccessToken = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await API.get("/test/all", {
        headers: { "x-access-token": storedAccessToken },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const defineColor = (score) => {
    switch (true) {
      case score >= 9 && score <= 10:
        return Color.Amazing;
      case score >= 7.5 && score < 9:
        return Color.Great;
      case score >= 6 && score < 7.5:
        return Color.Good;
      case score >= 4 && score < 6:
        return Color.Alright;
      case score >= 2 && score < 4:
        return Color.Low;
      case score >= 0 && score < 2:
        return Color.Exhausted;
      default:
        return "#000000"; // Handle cases outside defined ranges
    }
  };

  const defineBGColor = (score) => {
    switch (true) {
      case score >= 9 && score <= 10:
        return Color.AmazingBg;
      case score >= 7.5 && score < 9:
        return Color.GreatBg;
      case score >= 6 && score < 7.5:
        return Color.GoodBg;
      case score >= 4 && score < 6:
        return Color.AlrightBg;
      case score >= 2 && score < 4:
        return Color.LowBg;
      case score >= 0 && score < 2:
        return Color.ExhaustedBg;
      default:
        return "#000000"; // Handle cases outside defined ranges
    }
  };

  const defineClass = (score) => {
    switch (true) {
      case score >= 9 && score <= 10:
        return "amazing";
      case score >= 7.5 && score < 9:
        return "great";
      case score >= 6 && score < 7.5:
        return "good";
      case score >= 4 && score < 6:
        return "alright";
      case score >= 2 && score < 4:
        return "low";
      case score >= 0 && score < 2:
        return "exhausted";
      default:
        return ""; // Handle cases outside defined ranges
    }
  };

  const onOpenFactorDetailsModal = (factor) => {
    dispatch(
      getWellBeingFactorOvertime({
        userId: user.id,
        factor: factor,
      }),
    );
    setIsOpen(true);
    setSelectedFactor(factor);
  };

  return (
    <Box>
      <PageHeader
        title="Your Dashboard"
        filterOption={false}
        toolTipContent="Welcome to MyDaily! <br/><br/> We want to empower you to take charge of your well-being. That's why we've created a system that combines your own self-assessment with the insights of our AI technology.<br/><br/> Your rating is shared only with your direct manager to make sure you're both on the same page and can prioritize your well-being. But don't worry, the reasons behind your score are strictly private and only for your own self-reflection. You can choose to discuss them or not.<br/><br/> Our AI technology analyzes trends and patterns to provide personalized nudges and suggestions to help you improve your overall well-being. We believe that small changes can lead to big improvements, and we're here to support you every step of the way."
      />
      {/* <button onClick={onClickHandler}>Click me</button> */}
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
                isClickable={false}
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
        <Flex className={styles.factorRow} marginBottom={200}>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Workload"
              percentage={workloadScore}
              increase={true}
              statusText="Decrease since last week"
              color={defineColor(workloadScore)}
              bgColor={defineBGColor(workloadScore)}
              isHelperText
              helperTitle={"Workload"}
              helperText={
                "Workload reflects the manageability of your assigned tasks. It is calculated based on your responses to survey questions about task volume, time sufficiency, and control over your workload. Additionally, it incorporates data from integrations such as the number of tasks assigned, deadlines, and working hours. This factor helps identify if your workload is balanced and appropriate."
              }
              showDetails={() =>
                onOpenFactorDetailsModal(factorTableField.Workload)
              }
              isClickable={true}
            />
          </Box>
          <Box className={styles.factorCol}>
            <CircularProgressCard
              heading="Managerial support"
              percentage={relationshipsScore}
              increase={false}
              statusText="Decrease since last week"
              color={defineColor(relationshipsScore)}
              bgColor={defineBGColor(relationshipsScore)}
              isHelperText
              helperTitle={"Managerial Support"}
              helperText={
                "Managerial Support represents the level of assistance and guidance you receive from your manager. It is calculated from your survey responses about your manager’s accessibility, clarity of expectations, and helpfulness of feedback. This factor evaluates how effectively your manager supports you in your role."
              }
              showDetails={() =>
                onOpenFactorDetailsModal(factorTableField.Relationship)
              }
              isClickable={true}
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
              isHelperText
              helperTitle={"Time Boundaries"}
              helperText={
                "Time Boundaries measure your ability to maintain a separation between work and personal life. It is calculated using your survey responses regarding disconnecting after work, adherence to scheduled hours, and ability to take breaks. Integration data like emails sent outside of work hours and meeting times also contribute. This factor assesses whether you can maintain a healthy work-life balance."
              }
              showDetails={() =>
                onOpenFactorDetailsModal(factorTableField.TimeBoundaries)
              }
              isClickable={true}
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
              isHelperText
              helperTitle={"Autonomy"}
              helperText={
                "Autonomy measures the degree of freedom and trust you have in your role. It is calculated from your survey responses regarding your freedom to decide how to perform tasks, the trust placed in you to make decisions, and opportunities to choose or prioritize your work. This factor reflects the level of control you have over your work methods and decision-making."
              }
              showDetails={() =>
                onOpenFactorDetailsModal(factorTableField.Autonomy)
              }
              isClickable={true}
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
              isHelperText
              helperTitle={"Communication"}
              helperText={
                "Communication evaluates the effectiveness of information exchange within your team and with your manager. It is calculated based on your survey responses about the clarity of information received, acknowledgment of your ideas and concerns, and satisfaction with team communication. Integration data such as message frequency and response times may also be considered. This factor assesses how well communication facilitates your work."
              }
              showDetails={() =>
                onOpenFactorDetailsModal(factorTableField.Communication)
              }
              isClickable={true}
            />
          </Box>
        </Flex>
      </Box>
      {/* <Wellbeing /> */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody mt={10}>
            {wellBeingFactorOvertime && selectedFactor ? (
              <ZoomableChart
                data={wellBeingFactorOvertime.data}
                factor={selectedFactor}
              />
            ) : (
              <Text fontSize={"14px"}>No data</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Home;
