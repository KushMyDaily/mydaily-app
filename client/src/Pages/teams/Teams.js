import {
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Text,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import React, {
  useState,
  useEffect,
  //useCallback
} from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import OrganizationChart from "../../comps/OrganizationChart";
import PageHeader from "../../comps/PageHeader";
import Color from "../../utils/Color";
import Chart from "react-apexcharts";
import Legends from "../../comps/Legends";
import CircularProgressCard from "../../comps/CircularProgressCard";
//import TeamCard from "../../comps/TeamCard";
import ProgressCard from "../../comps/ProgressCard";
import ProgressBar from "../../comps/ProgressBar";
import styles from "./teams.module.css";
import {
  managerViewStat,
  getSubordinatesforms,
} from "../../redux/features/statsData/statDataThunk";
import goodIcon from "../../assets/img/check-icon.png";
import needAttentionError from "../../assets/img/red-error.png";
import coutionError from "../../assets/img/yellow-error.png";
import { LuZoomIn, LuZoomOut, LuRefreshCw } from "react-icons/lu";

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
  },
  grid: {
    show: false,
  },
  colors: [
    function ({ value }) {
      if (value > 5) {
        return "#11845B";
      }
      if (value > 4) {
        return "#05C168";
      }
      if (value > 3) {
        return "#98DC7F";
      }
      if (value > 2) {
        return "#FFCA43";
      }
      if (value > 1) {
        return "#FF9E2C";
      }
      if (value > 0) {
        return "#FF6871";
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

function Teams() {
  // eslint-disable-next-line no-unused-vars
  const [monthSeries, setMonthSeries] = useState([]);
  const [managerData, setManagerData] = useState({});
  const { user } = useSelector((state) => state.signin);
  const [organizationData, setOrganizationData] = useState({
    name: user.username,
    children: [],
  });
  const {
    //managerViewError,
    manager,
    subordinatesForms,
  } = useSelector((state) => state.statsData);

  const dispatch = useDispatch();

  const [stressFactors, setStressFactors] = useState([]);

  useEffect(() => {
    dispatch(
      managerViewStat({
        userId: user.id,
        date: getPreviousWeekday(new Date()),
      }),
    );
  }, []);

  useEffect(() => {
    if (manager) {
      setManagerData(manager);
      const mappedData = [
        {
          data: Array.from({ length: 12 }, (_, index) => {
            const monthData = manager.perMonth.find(
              (entry) => entry.month === index + 1,
            );
            return monthData ? parseFloat(monthData.score) : 0;
          }),
        },
      ];
      setMonthSeries(mappedData);

      if (manager.stressFactors) {
        const mappedStressFactors = [];
        Object.entries(manager.stressFactors).forEach(([key, value]) => {
          const stressFactor = {
            heading: getHeadingByKey(key),
            increase: true,
            statusText: "Increase since last month",
            imageUrl: getImageByValue(value),
          };
          mappedStressFactors.push(stressFactor);
        });
        setStressFactors(mappedStressFactors);
      }

      if (manager.subordinatesForm) {
        organizationData.children = manager.subordinatesForm.map(
          (subordinate) => ({
            id: subordinate.id,
            name: subordinate.userName,
            form: subordinate.form,
          }),
        );
        setOrganizationData(organizationData);
      }
    }
  }, [manager]);

  useEffect(() => {
    const mappedSubordinatesData = mapSubordinateData(
      organizationData,
      subordinatesForms,
    );

    setOrganizationData({
      name: user.username,
      children: mappedSubordinatesData,
    });
  }, [subordinatesForms]);

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

  const getHeadingByKey = (key) => {
    switch (key) {
      case "workload":
        return "Workload";
      case "autonomy":
        return "Autonomy";
      case "communication":
        return "Communication";
      case "relationship":
        return "Relationships";
      case "timeBoundries":
        return "Time Boundaries";
      default:
        return "";
    }
  };

  const getImageByValue = (value) => {
    switch (true) {
      case value >= 7.5:
        return goodIcon;
      case value >= 5.5 && value < 7.5:
        return coutionError;
      case value >= 0 && value < 5.5:
        return needAttentionError;
      default:
        return ""; // Handle cases outside defined ranges
    }
  };

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <ButtonGroup variant="outline" size="sm" isAttached pb={8}>
          <IconButton aria-label="zoom in" onClick={() => zoomIn()}>
            <LuZoomIn />
          </IconButton>
          <IconButton aria-label="zoom out" onClick={() => zoomOut()}>
            <LuZoomOut />
          </IconButton>
          <IconButton aria-label="reset" onClick={() => resetTransform()}>
            <LuRefreshCw />
          </IconButton>
        </ButtonGroup>
      </>
    );
  };

  const onHandleExpand = (userId) => {
    if (userId) {
      dispatch(
        getSubordinatesforms({
          userId: userId,
          date: getPreviousWeekday(new Date()),
        }),
      );
    }
  };

  function mapSubordinateData(initialData, managerData) {
    return initialData.children.map((child) => {
      // Check if the current child matches the managerId
      if (managerData && managerData.data) {
        if (child.id === managerData.data.managerId) {
          // Push subordinates as children
          const updatedChildren = managerData.data.subordinates.map((sub) => ({
            id: sub.id,
            name: sub.userName,
            form: sub.form,
          }));
          console.log(updatedChildren);
          return {
            ...child,
            children: updatedChildren, // Add subordinates to children
          };
        }
      }
      return { ...child, children: [] }; // Ensure non-matching nodes also have a children key
    });
  }

  return (
    <Box>
      <PageHeader
        title="Manager View"
        subTitle=""
        filterOption={false}
        toolTipContent="Welcome to the Your Team Page!<br/><br/> Accessible only by managers like yourself. Here, you can monitor your team's wellbeing in real-time, and understand the impact of decisions, events, and performance on your team.<br/><br/> Click on the three dots to change the time frame, or on a team member's name for more details. It's important to take action when negative trends arise, by encouraging positive behaviors and addressing any problems.<br/><br/> Remember not to share personal information. Let us support you in creating a healthier and happier work environment for everyone on your team."
      />
      {manager ? (
        <>
          <Legends />
          <Flex className={styles.chartRow}>
            <Box className={styles.chartCol}>
              <Flex className={styles.chartRowInner}>
                <Box className={styles.chartColInner}>
                  <CircularProgressCard
                    heading="Team Form"
                    percentage={managerData.formScore || 0}
                    increase={false}
                    statusText="Increase since last week"
                    color={defineColor(managerData.formScore || 0)}
                    bgColor={defineBGColor(managerData.formScore || 0)}
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
                          rating={managerData.last30Days || 0}
                          textColor={defineColor(managerData.last30Days || 0)}
                          progressColor={defineClass(
                            managerData.last30Days || 0,
                          )}
                        />
                      </Box>
                      <Box mb={12}>
                        <ProgressBar
                          heading="Last 90 days"
                          rating={managerData.last90Days || 0}
                          textColor={defineColor(managerData.last90Days || 0)}
                          progressColor={defineClass(
                            managerData.last90Days || 0,
                          )}
                        />
                      </Box>
                      <Box>
                        <ProgressBar
                          heading="All time"
                          rating={managerData.allTime || 0}
                          textColor={defineColor(managerData.allTime || 0)}
                          progressColor={defineClass(managerData.allTime || 0)}
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
                      series={monthSeries}
                      type="bar"
                      width="100%"
                      height={269}
                    />
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Flex>
          <Flex className={styles.cardRow}>
            {stressFactors.map((item) => (
              <Box key={item.heading} className={styles.cardCol}>
                <ProgressCard
                  heading={item.heading}
                  increase={item.increase}
                  statusText={item.statusText}
                  imageUrl={item.imageUrl}
                />
              </Box>
            ))}
          </Flex>
          <Box>
            <Text
              fontSize={"44px"}
              fontWeight={"500"}
              lineHeight={"52px"}
              marginBottom={7}
              color={"#000000"}
            >
              Your wellbeing factors
            </Text>
            <Text
              fontSize={"14px"}
              lineHeight={"20px"}
              marginBottom={2.5}
              color={"#000000"}
              opacity={"0.4"}
            >
              Your direct reports
            </Text>
          </Box>
          <Box
            className={styles.chartOrg}
            sx={{
              position: "relative",
              width: "100%",
              height: "100%", // Or any fixed/relative height
              overflow: "hidden",
            }}
          >
            <Card className={styles.DetailCard}>
              <TransformWrapper
                options={{
                  limitToBounds: true, // Keeps the chart within bounds
                }}
              >
                <Controls />
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                >
                  <OrganizationChart
                    data={organizationData}
                    onHandleExapand={onHandleExpand}
                  />
                </TransformComponent>
              </TransformWrapper>
            </Card>
          </Box>
        </>
      ) : (
        <Alert status="error" mt={8}>
          <AlertIcon />
          No subordinate data is available for the selected manager.
        </Alert>
      )}
    </Box>
  );
}

export default Teams;
