import {
  Box,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import Color from "../../utils/Color";
import styles from "./teamCard.module.css";

const TeamCard = ({
  heading,
  percentage,
  increase,
  statusText,
  onClick,
  personId,
  active,
}) => {
  let updateColor, updateBgColor;

  if (percentage > 9) {
    updateColor = Color.Amazing;
    updateBgColor = Color.AmazingBg;
  } else if (percentage > 8) {
    updateColor = Color.Great;
    updateBgColor = Color.GreatBg;
  } else if (percentage > 7) {
    updateColor = Color.Good;
    updateBgColor = Color.GoodBg;
  } else if (percentage > 6) {
    updateColor = Color.Alright;
    updateBgColor = Color.AlrightBg;
  } else if (percentage > 5) {
    updateColor = Color.Low;
    updateBgColor = Color.LowBg;
  } else {
    updateColor = Color.Exhausted;
    updateBgColor = Color.ExhaustedBg;
  }

  return (
    <Button
      height={"auto"}
      width={"100%"}
      padding={"0"}
      background={"transparent !important"}
      borderRadius={10}
      onClick={() => onClick(personId)}
      className={active == "true" ? styles.active : ""}
    >
      <Card className={styles.cardWrap}>
        <CardHeader padding="0" marginBottom="10px">
          <Text fontSize="22px" fontWeight="500" lineHeight="30px">
            {heading}
          </Text>
        </CardHeader>
        <CardBody padding={0}>
          <Box textAlign={"center"}>
            <CircularProgress
              size={210}
              value={percentage * 10}
              color={updateColor}
              trackColor={updateBgColor}
              capIsRound
              thickness={6}
              marginBottom="25px"
            >
              <CircularProgressLabel
                fontSize={"22px"}
                fontWeight={"500"}
                backgroundColor={updateColor}
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
    </Button>
  );
};

export default TeamCard;
