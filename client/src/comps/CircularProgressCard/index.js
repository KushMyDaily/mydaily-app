import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import styles from "./circularProgressCard.module.css";

const CircularProgressCard = ({
  heading,
  percentage,
  increase,
  statusText,
  color,
  bgColor,
}) => {
  return (
    <Card className={styles.cardWrap}>
      <CardHeader padding="0" marginBottom="15px">
        <Text fontSize="22px" fontWeight="500" lineHeight="30px">
          {heading}
        </Text>
      </CardHeader>
      <CardBody padding={0}>
        <Box textAlign={"center"}>
          <CircularProgress
            size={200}
            value={percentage * 10}
            color={color}
            trackColor={bgColor}
            capIsRound
            thickness={6}
            marginBottom="30px"
            className={styles.circularProgress}
          >
            <CircularProgressLabel
              fontSize={"22px"}
              fontWeight={"500"}
              backgroundColor={color}
              w={86}
              height={86}
              color={"#fff"}
              borderRadius={"50%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {percentage}
            </CircularProgressLabel>
          </CircularProgress>
          <Flex alignItems={"flex-start"}>
            {increase ? (
              <FiArrowUpRight fontSize={24} />
            ) : (
              <FiArrowDownRight fontSize={24} />
            )}
            <Text
              fontSize={"14px"}
              line-height={5}
              fontWeight={"400"}
              paddingTop={0.5}
              paddingLeft={2}
              textAlign={"left"}
            >
              {statusText}
            </Text>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  );
};

export default CircularProgressCard;
