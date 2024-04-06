import React, { useEffect } from "react";
import {
  Button,
  HStack,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  Box,
  Text,
  useDisclosure,
  useRadioGroup,
} from "@chakra-ui/react";
import DropdownIcon from "../../assets/dropdown.svg";
import RadioCard from "../RadioCard";
import styles from "./filterButton.module.css";

function ButtonFilter({ options, label, title, setSelectedTag }) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: "category",
    defaultValue: "",
    onChange: (value) => {
      setSelectedTag(value.toLowerCase());
    },
  });

  const group = getRootProps();
  // when reset filter
  useEffect(() => {
    if (setSelectedTag === "") {
      setValue("");
    }
  }, [setSelectedTag]);
  return (
    <Button
      className={styles.filterButton}
      onClick={onToggle}
      disabled={{ md: "none" }}
    >
      <Box className={styles.filterButtonTitle}>
        {title} <Image src={DropdownIcon} />
      </Box>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        closeOnBlur={true}
        isLazy
        lazyBehavior="keepMounted"
        className={styles.filterPopup}
      >
        <PopoverContent w={"100%"} className={styles.filterPopupContent}>
          <PopoverBody p={"24px"}>
            <Text
              fontWeight={"700"}
              fontSize={"18px"}
              textAlign={"left"}
              mb={"25px"}
            >
              {label}
            </Text>
            <HStack {...group} className={styles.filterPopupList}>
              {options.map((value, index) => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard index={index} key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Button>
  );
}

export default ButtonFilter;
