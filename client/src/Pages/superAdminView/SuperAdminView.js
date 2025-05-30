import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  Box,
  Card,
  Text,
  Select,
  Flex,
  CardBody,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Alert,
  AlertIcon,
  Avatar,
  AvatarBadge,
  Badge,
  CardHeader,
} from "@chakra-ui/react";
import Legends from "../../comps/Legends";
import Chart from "react-apexcharts";
import PageHeader from "../../comps/PageHeader";
import styles from "./superAdminView.module.css";
import Color from "../../utils/Color";
import CircularProgressCard from "../../comps/CircularProgressCard";
import {
  getCompanyData,
  getCompanyDetails,
  getSurveyresponse,
  clearAllStatus,
} from "../../redux/features/superUser/superUserThunk";
import { MdStar } from "react-icons/md";

const OPTIONS = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: [],
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
    min: 0,
    max: 100,
  },
  grid: {
    show: false,
  },
  colors: [
    function ({ value }) {
      if (value >= 90 && value <= 100) {
        return Color.Amazing;
      }
      if (value >= 75 && value < 90) {
        return Color.Great;
      }
      if (value >= 60 && value < 75) {
        return Color.Good;
      }
      if (value >= 40 && value < 60) {
        return Color.Alright;
      }
      if (value >= 20 && value < 40) {
        return Color.Low;
      }
      if (value >= 0 && value < 20) {
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

const SuperAdminView = () => {
  const dispatch = useDispatch();
  const { companyData, companyDetails, surveyResponse } = useSelector(
    (state) => state.superUser,
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [chartOptions, setChartOptions] = useState(OPTIONS);
  const [chartSeriesData, setChartSeriesData] = useState([]);
  const handleCompanyChange = (event) => {
    setSelectedCompanyId(event.target.value);
  };

  useEffect(() => {
    dispatch(getCompanyData());
    return () => {
      dispatch(clearAllStatus());
    };
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(getCompanyDetails(selectedCompanyId));
      dispatch(
        getSurveyresponse({
          companyId: selectedCompanyId,
          date: moment().subtract(1, "days").format("YYYY-MM-DD"),
        }),
      );
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (surveyResponse && surveyResponse.lastWeekSRR) {
      const days = surveyResponse.lastWeekSRR.map((entry) => entry.day);
      const srr = surveyResponse.lastWeekSRR.map((entry) => entry.srr);

      const chartSeriesData = srr.length > 0 ? [{ data: srr }] : [];
      if (days.length > 0) {
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: days,
          },
        }));
      }

      setChartSeriesData(chartSeriesData);
    }
  }, [surveyResponse]);

  const defineColor = (score) => {
    switch (true) {
      case score >= 90 && score <= 100:
        return Color.Amazing;
      case score >= 75 && score < 90:
        return Color.Great;
      case score >= 60 && score < 75:
        return Color.Good;
      case score >= 40 && score < 60:
        return Color.Alright;
      case score >= 20 && score < 40:
        return Color.Low;
      case score >= 0 && score < 20:
        return Color.Exhausted;
      default:
        return "#000000"; // Handle cases outside defined ranges
    }
  };

  const defineBGColor = (score) => {
    switch (true) {
      case score >= 90 && score <= 100:
        return Color.AmazingBg;
      case score >= 75 && score < 90:
        return Color.GreatBg;
      case score >= 60 && score < 75:
        return Color.GoodBg;
      case score >= 40 && score < 60:
        return Color.AlrightBg;
      case score >= 20 && score < 40:
        return Color.LowBg;
      case score >= 0 && score < 20:
        return Color.ExhaustedBg;
      default:
        return "#000000"; // Handle cases outside defined ranges
    }
  };
  return (
    <Box>
      <PageHeader
        title="Super Admin View"
        subTitle=""
        filterOption={false}
        toolTipContent=""
      />
      <Box className={styles.chartColInner}>
        <Box mt={5}>
          <Flex gap={5}>
            <Box w="60%">
              <Card className={styles.DetailCard}>
                <Flex gap={5}>
                  <Box w="50%">
                    <Text
                      fontSize={"22px"}
                      fontWeight={"500"}
                      lineHeight={"30px"}
                      marginBottom={1}
                    >
                      Select a Company
                    </Text>
                  </Box>
                  <Box w="50%">
                    {Array.isArray(companyData) && companyData.length > 0 ? (
                      <Select
                        placeholder="Select a company"
                        onChange={handleCompanyChange}
                        value={selectedCompanyId}
                      >
                        {companyData.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Alert status="warning">
                        <AlertIcon />
                        No companies available
                      </Alert>
                    )}
                  </Box>
                </Flex>
              </Card>
            </Box>
            <Box w="40%">
              {companyDetails && (
                <Card className={styles.CompanyCard}>
                  <Flex gap={3}>
                    <Box w="20%" textAlign={"center"} mt={5}>
                      <Avatar name={companyDetails.name}>
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </Avatar>
                    </Box>
                    <Box w="80%">
                      <Flex align="baseline" mt={2}>
                        <Badge colorScheme="pink">
                          {companyDetails.domain}
                        </Badge>
                        <Text
                          ml={2}
                          textTransform="uppercase"
                          fontSize="sm"
                          fontWeight="bold"
                          color="pink.800"
                        >
                          Domain Verified &bull; Company
                        </Text>
                      </Flex>
                      <Text
                        mt={2}
                        fontSize="xl"
                        fontWeight="semibold"
                        lineHeight="short"
                      >
                        {companyDetails.name}
                      </Text>
                      <Flex mt={2} align="center">
                        <Box as={MdStar} color="orange.400" />
                        <Text ml={1} fontSize="sm">
                          <b>{companyDetails.subscriptions || 0}</b>{" "}
                          Subscription
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Card>
              )}
            </Box>
          </Flex>
        </Box>
        <Box mt={5}>
          <Flex gap={5}>
            <Box w="75%">
              {surveyResponse && (
                <Card boxShadow={"none"}>
                  <CardHeader>
                    <Text fontSize="22px" fontWeight="500" lineHeight="30px">
                      Last Week SRR
                    </Text>
                  </CardHeader>
                  <CardBody padding={"25px 15px 25px"}>
                    <Legends />
                    <Box className="ChartBox">
                      <Chart
                        options={chartOptions}
                        series={chartSeriesData}
                        type="bar"
                        width="100%"
                        height="500px"
                      />
                    </Box>
                  </CardBody>
                </Card>
              )}
            </Box>
            <Box w="25%" h={"230px"}>
              {surveyResponse && (
                <CircularProgressCard
                  heading="Last day SRR"
                  percentage={surveyResponse?.lastDaySRR || 0}
                  isHelperText
                  helperTitle={"SRR"}
                  helperText={
                    "This reflects the users' survey response rate for today."
                  }
                  color={defineColor(surveyResponse?.lastDaySRR || 0)}
                  bgColor={defineBGColor(surveyResponse?.lastDaySRR || 0)}
                />
              )}
            </Box>
          </Flex>
        </Box>
        <Box mt={5}>
          <Flex gap={5}>
            <Box w="75%">
              {companyDetails && (
                <Card boxShadow={"none"}>
                  <CardBody p={5}>
                    <TableContainer>
                      <Table variant="simple">
                        <TableCaption>Company user details</TableCaption>
                        <Thead>
                          <Tr>
                            <Th>Username</Th>
                            <Th>Emails</Th>
                            <Th>Manager</Th>
                            <Th>Position</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {companyDetails?.users?.length > 0 ? (
                            companyDetails.users.map((user) => (
                              <Tr key={user.id}>
                                <Td>{user.username}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.manager}</Td>
                                <Td>{user.position}</Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td colSpan="4">No users available</Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              )}
            </Box>
            <Box w="25%" />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default SuperAdminView;
