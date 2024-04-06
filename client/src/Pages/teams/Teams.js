import { Box, Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import React, { useState, useCallback } from "react";
import PageHeader from "../../comps/PageHeader";
import Color from "../../utils/Color";
import Chart from "react-apexcharts";
import Legends from "../../comps/Legends";
import CircularProgressCard from "../../comps/CircularProgressCard";
import TeamCard from "../../comps/TeamCard";
import ProgressCard from "../../comps/ProgressCard";
import ProgressBar from "../../comps/ProgressBar";
import styles from "./teams.module.css";

const CardData = [
  {
    heading: "Workload",
    increase: true,
    statusText: "Increase since last month",
    imageUrl: "../images/check-icon.png",
  },
  {
    heading: "Time boundaries",
    increase: true,
    statusText: "Increase since last month",
    imageUrl: "../images/check-icon.png",
  },
  {
    heading: "Communication",
    increase: false,
    statusText: "Decrease since last month",
    imageUrl: "../images/red-error.png",
  },
  {
    heading: "Autonomy",
    increase: false,
    statusText: "Decrease since last month",
    imageUrl: "../images/yellow-error.png",
  },
  {
    heading: "Relationships",
    increase: true,
    statusText: "Increase since last month",
    imageUrl: "../images/check-icon.png",
  },
];

const teams = [
  {
    id: "1",
    role: "role1 Team",
    progress: 9.4,
    increase: true,
    statusText: "Increase since last month",
    heading: "Your second line reports",
    managing: [
      {
        id: "a1",
        role: "role1.1 Team",
        name: "[name]",
        progress: 9.4,
        increase: true,
        statusText: "Increase since last month",
        heading: "Your third line reports",
        managing: [
          {
            id: "b1",
            role: "[role1.1.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "b2",
            role: "role1.1.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "b3",
            role: "role1.1.3 Team",
            name: "[name]",
            progress: 7.2,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
      {
        id: "a2",
        role: "role1.2 Team",
        name: "[name]",
        progress: 8.9,
        increase: true,
        statusText: "Increase since last month",
        managing: [
          {
            id: "b1",
            role: "[role1.2.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "b2",
            role: "role1.2.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    role: "role2 Team",
    progress: 8.9,
    increase: false,
    statusText: "Decrease since last month",
    heading: "Your second line reports",
    managing: [
      {
        id: "c1",
        role: "role2.1 Team",
        name: "[name]",
        progress: 9.4,
        increase: true,
        statusText: "Increase since last month",
        heading: "Your third line reports",
        managing: [
          {
            id: "d1",
            role: "role2.1.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "d2",
            role: "role2.1.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "d3",
            role: "role2.1.3 Team",
            name: "[name]",
            progress: 7.2,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "d3",
            role: "role2.1.4 Team",
            name: "[name]",
            progress: 6.8,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
      {
        id: "c2",
        role: "role2.2 Team",
        name: "[name]",
        progress: 8.9,
        increase: true,
        statusText: "Increase since last month",
        managing: [
          {
            id: "d1",
            role: "role2.2.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "d2",
            role: "role2.2.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
      {
        id: "c3",
        role: "role2.3 Team",
        name: "[name]",
        progress: 7.2,
        increase: true,
        statusText: "Increase since last month",
        managing: [
          {
            id: "d1",
            role: "role2.3.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "d2",
            role: "role2.3.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "d3",
            role: "role2.3.3 Team",
            name: "[name]",
            progress: 7.2,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    role: "role3 Team",
    progress: 7.2,
    increase: false,
    statusText: "Decrease since last month",
    heading: "Your second line reports",
    managing: [
      {
        id: "e1",
        role: "role3.1 Team",
        name: "[name]",
        progress: 9.4,
        increase: true,
        statusText: "Increase since last month",
        heading: "Your third line reports",
        managing: [
          {
            id: "f1",
            role: "role3.1.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f2",
            role: "role3.1.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f3",
            role: "role3.1.3 Team",
            name: "[name]",
            progress: 7.2,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f4",
            role: "role3.1.4 Team",
            name: "[name]",
            progress: 6.2,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f5",
            role: "role3.1.5 Team",
            name: "[name]",
            progress: 5.2,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
      {
        id: "e2",
        role: "role3.2 Team",
        name: "[name]",
        progress: 8.9,
        increase: true,
        statusText: "Increase since last month",
        managing: [
          {
            id: "f1",
            role: "role3.2.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f2",
            role: "role3.2.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f3",
            role: "role3.2.3 Team",
            name: "[name]",
            progress: 7.2,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
      {
        id: "e3",
        role: "role3.3 Team",
        name: "[name]",
        progress: 7.2,
        increase: true,
        statusText: "Increase since last month",
        managing: [
          {
            id: "f1",
            role: "role3.3.1 Team",
            name: "[name]",
            progress: 9.4,
            increase: true,
            statusText: "Increase since last month",
          },
          {
            id: "f2",
            role: "role3.3.2 Team",
            name: "[name]",
            progress: 8.9,
            increase: true,
            statusText: "Increase since last month",
          },
        ],
      },
    ],
  },
];

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
  const [series, setSeries] = useState([
    {
      data: [5, 4.8, 2.7, 2.9, 3.6, 4, 4.6, 4.8, 5.1, 5.3, 2, 0.75],
    },
  ]);

  const [secondReport, setSecondReport] = useState([]);
  const [thirdReport, setThirdReport] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [activeSecondReport, setActiveSecondReport] = useState(null);

  const handleClick = useCallback((personId) => {
    setActiveReport(personId);
    const report2 = teams?.find((item) => item.id === personId);
    setSecondReport([...report2.managing]);
    setThirdReport([]);
  });

  const handle2Click = useCallback((personId) => {
    setActiveSecondReport(personId);
    // const report3 = secondReport?.find((item) => item.id === personId);
    // setThirdReport([...report3?.managing]);
    // console.log(thirdReport, '[thirdReport');
  });

  return (
    <Box>
      <PageHeader
        title="Manager View"
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
                heading="Team Form"
                percentage="7.2"
                increase={false}
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
      <Flex className={styles.cardRow}>
        {CardData.map((item) => (
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
        <Flex className={styles.teamRow}>
          {teams.map((items) => (
            <Box key={items.id} className={styles.teamCol}>
              <TeamCard
                heading={items.role}
                subheading={items.name}
                percentage={items.progress}
                increase={items.increase}
                statusText="Increase since last week"
                onClick={handleClick}
                active={items.id === activeReport ? "true" : "false"}
                personId={items.id}
              />
            </Box>
          ))}
        </Flex>
        {secondReport.length !== 0 && (
          <Text
            fontSize={"14px"}
            lineHeight={"20px"}
            marginBottom={2.5}
            color={"#000000"}
            opacity={"0.4"}
          >
            Your second line reports
          </Text>
        )}
        <Flex className={styles.teamRow}>
          {secondReport?.map((items) => (
            <Box key={items.id} className={styles.teamCol}>
              <TeamCard
                heading={items.role}
                subheading={items.name}
                percentage={items.progress}
                increase={items.increase}
                statusText="Increase since last week"
                onClick={handle2Click}
                active={items.id === activeSecondReport ? "true" : "false"}
                personId={items.id}
              />
            </Box>
          ))}
        </Flex>
        {thirdReport.length !== 0 && (
          <Text
            fontSize={"14px"}
            lineHeight={"20px"}
            marginBottom={2.5}
            color={"#000000"}
            opacity={"0.4"}
          >
            Your third line reports
          </Text>
        )}
        <Flex className={styles.teamRow}>
          {thirdReport?.map(
            (items) =>
              items.length !== 0 && (
                <Box key={items.id} className={styles.teamCol}>
                  <TeamCard
                    heading={items.role}
                    subheading={items.name}
                    percentage={items.progress}
                    increase={items.increase}
                    statusText="Increase since last week"
                    onClick={() => {}}
                  />
                </Box>
              ),
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default Teams;
