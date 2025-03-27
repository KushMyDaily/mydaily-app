import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import styles from "./sidebar.module.css";
import { BiUser, BiGlobe } from "react-icons/bi";
import {
  AiOutlineTeam,
  AiOutlineSetting,
  AiOutlineBarChart,
} from "react-icons/ai";
//import { HiOutlineMap } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const location = useLocation();
  const { userRole } = useSelector((state) => state.signin);

  const currentUrl = location.pathname;

  return (
    <>
      <Flex
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
        className={styles.sidebar}
      >
        <Flex
          flexWrap="wrap"
          alignItems="center"
          flexDirection="column"
          width="100%"
        >
          <Text className={styles.title}>MyDaily</Text>
          {(userRole[0] === "ROLE_USER" ||
            userRole[0] === "ROLE_GROUP_ADMIN" ||
            userRole[0] === "ROLE_ORG_ADMIN" ||
            userRole[0] === "ROLE_SUPER_ADMIN") && (
            <Link className={styles.link} to={"/dashboard"}>
              <BiUser
                size={24}
                color={currentUrl === "/dashboard" ? "black" : "lightgray"}
              />
            </Link>
          )}
          {(userRole[0] === "ROLE_USER" ||
            userRole[0] === "ROLE_GROUP_ADMIN" ||
            userRole[0] === "ROLE_ORG_ADMIN" ||
            userRole[0] === "ROLE_SUPER_ADMIN") && (
            <Link className={styles.link} to={"/company-view"}>
              <BiGlobe
                size={24}
                color={currentUrl === "/company-view" ? "black" : "lightgray"}
              />
            </Link>
          )}
          {(userRole[0] === "ROLE_ORG_ADMIN" ||
            userRole[0] === "ROLE_SUPER_ADMIN") && (
            <Link className={styles.link} to={"/teams"}>
              <AiOutlineTeam
                size={24}
                color={currentUrl === "/teams" ? "black" : "lightgray"}
              />
            </Link>
          )}
          {userRole[0] === "ROLE_SUPER_ADMIN" && (
            <Link className={styles.link} to={"/super-admin-view"}>
              <AiOutlineBarChart
                size={24}
                color={
                  currentUrl === "/super-admin-view" ? "black" : "lightgray"
                }
              />
            </Link>
          )}
          {/* {(userRole[0] === "ROLE_USER" ||
            userRole[0] === "ROLE_GROUP_ADMIN" ||
            userRole[0] === "ROLE_ORG_ADMIN" ||
            userRole[0] === "ROLE_SUPER_ADMIN") && (
            <Link className={styles.link} to={"/wellbeing-apps"}>
              <HiOutlineMap
                size={24}
                color={currentUrl === "/wellbeing-apps" ? "black" : "lightgray"}
              />
            </Link>
          )} */}
        </Flex>
        <Link to={"/settings"}>
          <AiOutlineSetting
            size={24}
            color={currentUrl === "/settings" ? "black" : "lightgray"}
          />
        </Link>
      </Flex>
    </>
  );
}

export default Sidebar;
