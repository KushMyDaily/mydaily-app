import { Box, Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
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

function CompanyView() {
  // eslint-disable-next-line no-unused-vars
  const [series, setSeries] = useState([
    {
      data: [5, 4.8, 2.7, 2.9, 3.6, 4, 4.6, 4.8, 5.1, 5.3, 2, 0.75],
    },
  ]);

  return (
    <Box>
      <PageHeader
        title="Company View"
        subTitle=""
        filterOption={false}
        toolTipContent="Welcome to the Your Team Page!<br/><br/> Accessible only by managers like yourself. Here, you can monitor your team's wellbeing in real-time, and understand the impact of decisions, events, and performance on your team.<br/><br/> Click on the three dots to change the time frame, or on a team member's name for more details. It's important to take action when negative trends arise, by encouraging positive behaviors and addressing any problems.<br/><br/> Remember not to share personal information. Let us support you in creating a healthier and happier work environment for everyone on your team."
      />
      <Legends />
      <Flex className={styles.chartRow}>
        <Box className={styles.chartCol}>
          <Flex className={styles.chartRowInner}>
            <Box className={styles.chartColInner}>
              <CircularProgressCard
                heading="Company Form"
                percentage="7.2"
                increase={true}
                statusText="Increase since last week"
                color={Color.Good}
                bgColor={Color.GoodBg}
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
                      rating="7.5"
                      textColor={Color.Good}
                      progressColor="good"
                    />
                  </Box>
                  <Box mb={12}>
                    <ProgressBar
                      heading="Last 90 days"
                      rating="6.6"
                      textColor={Color.Alright}
                      progressColor="alright"
                    />
                  </Box>
                  <Box>
                    <ProgressBar
                      heading="All time"
                      rating="6.6"
                      textColor={Color.Alright}
                      progressColor="alright"
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
              <Text fontSize={"22px"} fontWeight={"500"} lineHeight={"30px"}>
                Average Form per month
              </Text>
              <Box className="ChartBox">
                <Chart
                  options={OPTIONS}
                  series={series}
                  type="bar"
                  width="100%"
                  height={269}
                />
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}

export default CompanyView;
