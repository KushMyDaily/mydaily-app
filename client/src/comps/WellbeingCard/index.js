import React from "react";
import styles from "./wellbeingCard.module.css";
import { Box, Image, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const WellbeingCard = ({ title, description, image, tags }) => {
  return (
    <Box className={styles.wbwrapper}>
      <Flex className={styles.tagWrapper}>
        {tags?.map((item, index) => {
          return (
            <Box key={index} className={`tagColor ${item.color}`}>
              {item?.name}
            </Box>
          );
        })}
      </Flex>
      {/* <Box maxWidth="sm">
      </Box> */}
      <Image
        src={image}
        className={styles.wbImage}
        objectFit="cover"
        boxSize="100%"
      />

      {/* <img alt="cardImage" src={image} className="wbImage" /> */}

      <Text className={styles.wbTitle}>{title}</Text>
      <Text className={styles.wbDescription}>{description}</Text>
      <Box textAlign="right">
        <Link to="" className={styles.wbDetails}>
          Details
        </Link>
      </Box>
    </Box>
  );
};

export default WellbeingCard;
