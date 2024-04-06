import { Box, useRadio } from "@chakra-ui/react";
import styles from "./radioCard.module.css";

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" className={styles.radioBtn} ms={0}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        border="0.6px solid #979797"
        borderRadius="8888px"
        boxShadow="sm"
        _checked={{
          bg: "rgba(67, 57, 242, 0.13)",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default RadioCard;
