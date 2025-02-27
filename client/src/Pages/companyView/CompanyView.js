import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getCompanyWellBeingData } from "../../redux/features/statsData/statDataThunk";
import PageHeader from "../../comps/PageHeader";
import Color from "../../utils/Color";
import Chart from "react-apexcharts";

import Legends from "../../comps/Legends";
import CircularProgressCard from "../../comps/CircularProgressCard";
import ProgressBar from "../../comps/ProgressBar";
import styles from "./companyView.module.css";

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

function CompanyView() {
  // eslint-disable-next-line no-unused-vars
  const [companyForm, setCompanyForm] = useState(0);
  const [formLast30Days, setFormLast30Days] = useState(0);
  const [formLast90Days, setFormLast90Days] = useState(0);
  const [formLast365Days, setFormLast365Days] = useState(0);
  const [monthlyAverages, setMonthlyAverages] = useState([]);

  const { companyWellBeingData } = useSelector((state) => state.statsData);
  const { user } = useSelector((state) => state.signin);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getCompanyWellBeingData({
        companyId: user.companyId,
        date: getPreviousWeekday(new Date()),
      }),
    );
  }, []);

  useEffect(() => {
    if (companyWellBeingData && companyWellBeingData.data) {
      setCompanyForm(companyWellBeingData.data.companyForm);
      setFormLast30Days(companyWellBeingData.data.formLast30Days);
      setFormLast90Days(companyWellBeingData.data.formLast90Days);
      setFormLast365Days(companyWellBeingData.data.formLast365Days);

      const charSeriesData = companyWellBeingData.data.companyMonthlyForm.map(
        (month) => {
          return month.averageCompanyForm;
        },
      );

      setMonthlyAverages([{ data: charSeriesData }]);
    }
  }, [companyWellBeingData]);

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

  return (
    <Box>
      <PageHeader
        title="Company View"
        subTitle=""
        filterOption={false}
        toolTipContent="Welcome to the Your Team Page!<br/><br/> Accessible only by managers like yourself. Here, you can monitor your team's wellbeing in real-time, and understand the impact of decisions, events, and performance on your team.<br/><br/> Click on the three dots to change the time frame, or on a team member's name for more details. It's important to take action when negative trends arise, by encouraging positive behaviors and addressing any problems.<br/><br/> Remember not to share personal information. Let us support you in creating a healthier and happier work environment for everyone on your team."
      />
      {companyWellBeingData ? (
        <>
          <Legends />
          <Flex className={styles.chartRow}>
            <Box className={styles.chartCol}>
              <Flex className={styles.chartRowInner}>
                <Box className={styles.chartColInner}>
                  <CircularProgressCard
                    heading="Company Form"
                    percentage={companyForm}
                    increase={true}
                    statusText="Increase since last week"
                    color={defineColor(companyForm)}
                    bgColor={defineBGColor(companyForm)}
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
                        marginBottom={10}
                        color={"#000000"}
                        opacity={"0.4"}
                      >
                        Average form score
                      </Text>
                      <Box mb={12}>
                        <ProgressBar
                          heading="Last 30 days"
                          rating={formLast30Days}
                          textColor={defineColor(formLast30Days)}
                          progressColor={defineClass(formLast30Days)}
                        />
                      </Box>
                      <Box mb={12}>
                        <ProgressBar
                          heading="Last 90 days"
                          rating={formLast90Days}
                          textColor={defineColor(formLast90Days)}
                          progressColor={defineClass(formLast90Days)}
                        />
                      </Box>
                      <Box>
                        <ProgressBar
                          heading="All time"
                          rating={formLast365Days}
                          textColor={defineColor(formLast365Days)}
                          progressColor={defineClass(formLast365Days)}
                        />
                      </Box>
                    </CardBody>
                  </Card>
                </Box>
              </Flex>
            </Box>

            <Box className={styles.chartCol}>
              <Card boxShadow={"none"} borderRadius={"10px"}>
                <CardBody padding={"30px 27px 16px"}>
                  <Text
                    fontSize={"22px"}
                    fontWeight={"500"}
                    lineHeight={"30px"}
                  >
                    Average Form per month
                  </Text>
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
          </Flex>
        </>
      ) : (
        <Alert status="error" mt={8}>
          <AlertIcon />
          No Company data.
        </Alert>
      )}
    </Box>
  );
}

export default CompanyView;
