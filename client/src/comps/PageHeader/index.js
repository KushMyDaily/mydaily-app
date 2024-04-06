import { Box, Button, Flex, Image, Popover, Text } from "@chakra-ui/react";
import React from "react";
import FilterIcon from "../../assets/filter.svg";
import ResetIcon from "../../assets/reset.svg";
import { FiInfo } from "react-icons/fi";

import ButtonFilter from "../ButtonFilter";
import styles from "./style.module.css";
function PageHeader({
  title,
  subTitle,
  toolTipContent,
  filterOption,
  data,
  setFilterData,
  setSelectedTag,
}) {
  const resetFilter = () => {
    setFilterData(data);
  };

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text className={styles.pageTitle}>{title}</Text>
        {subTitle && (
          <Text
            className={styles.pageSubTitle}
            fontSize="sm"
            opacity={0.4}
            fontWeight={"500"}
          >
            {subTitle}
          </Text>
        )}
      </Box>
      {filterOption && (
        <Box className={styles.filter}>
          <Box className={styles.filterIconWrap}>
            <Image src={FilterIcon} alt={"filter"} />
          </Box>
          <Text className={styles.filterTitle}>Filter By</Text>
          <ButtonFilter
            setSelectedTag={setSelectedTag}
            options={[
              "Sleep",
              "Stress",
              "Meditation",
              "Focus",
              "Anxiety",
              "Health",
              "Exercise",
              "Therapy",
              "Nutrition",
            ]}
            label={"Select Topic"}
            title={"Topics"}
          />
          <ButtonFilter
            setSelectedTag={setSelectedTag}
            options={["App Store", "Play Store", "Web App"]}
            label={"Select Platform"}
            title={"Platform"}
          />
          <ButtonFilter
            setSelectedTag={setSelectedTag}
            options={["English", "French", "German", "Italian", "Spanish"]}
            label={"Select Language"}
            title={"Language"}
          />

          <Button onClick={() => resetFilter()} className={styles.filterReset}>
            <Image src={ResetIcon} mr={2} width="18px" height="18px" /> Reset
            Filter
          </Button>
        </Box>
      )}
      {toolTipContent && (
        <Box display={"flex"}>
          <Popover strategy="fixed" placement="left" boxShadow={"none"}>
            <div className={styles.tooltipContainer}>
              <FiInfo fontSize="24px" />
              <Box className={styles.tooltip}>
                <Text
                  className={styles.tooltipContent}
                  dangerouslySetInnerHTML={{ __html: toolTipContent }}
                ></Text>
              </Box>
            </div>
          </Popover>
        </Box>
      )}
    </Flex>
  );
}

export default PageHeader;
