import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Popover,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowDownRight, FiArrowUpRight, FiInfo } from "react-icons/fi";
import styles from "./circularProgressCard.module.css";

const CircularProgressCard = ({
  heading,
  percentage,
  increase,
  statusText,
  color,
  bgColor,
  isHelperText = false,
  helperTitle,
  helperText,
  showDetails,
  isClickable = false,
}) => {
  return (
    <Card className={styles.cardWrap}>
      <CardHeader padding="0" marginBottom="15px">
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="22px" fontWeight="500" lineHeight="30px">
            {heading}
          </Text>
          {isHelperText && (
            <Popover placement="left" strategy="fixed" boxShadow={"none"}>
              <div className={styles.tooltipContainer}>
                <FiInfo fontSize="24px" />
                <Box className={styles.tooltip}>
                  <PopoverHeader fontWeight="semibold">
                    {helperTitle}
                  </PopoverHeader>
                  <PopoverBody>
                    <Text
                      className={styles.tooltipContent}
                      dangerouslySetInnerHTML={{ __html: helperText }}
                    ></Text>
                  </PopoverBody>
                </Box>
              </div>
            </Popover>
          )}
        </Flex>
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
            className={isClickable ? styles.circularProgress : ""}
            onClick={() => (isClickable ? showDetails() : null)}
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
          {statusText && (
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
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

export default CircularProgressCard;
