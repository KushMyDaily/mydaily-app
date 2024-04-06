import { Box, Text } from "@chakra-ui/react";
import React from "react";
import Color from "../../utils/Color";

function Legends({ min, max }) {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      className="legends"
      flexWrap={"wrap"}
    >
      {["Amazing", "Great", "Good", "Alright", "Low", "Exhausted"]
        .slice(min, max)
        .map((item) => (
          <Box key={item} display={"flex"} alignItems={"center"} px={1.5}>
            <Box
              borderRadius={9}
              width="14px"
              height="14px"
              backgroundColor={Color[item]}
            />
            <Text fontSize={"sm"} pl="7px">
              {item}
            </Text>
          </Box>
        ))}
    </Box>
  );
}

export default Legends;
