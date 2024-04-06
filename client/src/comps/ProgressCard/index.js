import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  Image,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowDownRight, FiArrowUpRight, FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./progressCard.module.css";

// eslint-disable-next-line prettier/prettier, no-unused-vars
const ProgressCard = ({
  heading,
  imageUrl,
  increase,
  statusText,
  // eslint-disable-next-line no-unused-vars
  color,
  // eslint-disable-next-line no-unused-vars
  bgColor,
}) => {
  return (
    <Link to={"/"}>
      <Card className={styles.cardWrap}>
        <CardHeader padding="0">
          <Box
            variant="link"
            background="transparent"
            height="24px"
            width="24px"
            minWidth="unset"
            position="absolute"
            top="14px"
            right="14px"
          >
            <FiLogIn fontSize="22px" color="#000000" opacity="0.2" />
          </Box>
          <Text
            fontSize="22px"
            fontWeight="500"
            lineHeight="29px"
            textAlign={"center"}
          >
            {heading}
          </Text>
        </CardHeader>
        <CardBody padding={0}>
          <Box padding="56px 0 76px">
            <Image
              display="block"
              margin="0 auto"
              boxSize="85px"
              src={imageUrl}
              alt=""
            />
          </Box>
          <Box textAlign={"center"}>
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
    </Link>
  );
};

export default ProgressCard;
