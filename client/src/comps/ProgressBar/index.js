import { Flex, Text, Progress, Box } from "@chakra-ui/react";
import React from "react";

const ProgressBar = ({ heading, rating, textColor, progressColor }) => {
  return (
    <Box className={progressColor}>
      <Flex
        mb={2}
        flexWrap={"wrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"14px"} lineHeight={"20px"} fontWeight={"500"}>
          {heading}
        </Text>
        <Text
          fontSize={"14px"}
          lineHeight={"20px"}
          fontWeight={"500"}
          color={textColor}
        >
          {rating}
        </Text>
      </Flex>
      <Progress value={rating * 10} height={2} className="progressBar" />
    </Box>
  );
};

export default ProgressBar;
