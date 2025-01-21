import {
  Avatar,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  AvatarBadge,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { useSelector } from "react-redux";

function Header() {
  const { user } = useSelector((state) => state.signin);
  return (
    <Flex
      flexWrap="wrap"
      alignItems="flex-start"
      justifyContent="space-between"
      gap="2"
      marginBottom="20px"
    >
      <InputGroup className={styles.searchWrap}>
        <InputLeftElement
          pointerEvents="none"
          className={styles.searchIconWrap}
        >
          <BiSearch className={styles.searchIcon} />
        </InputLeftElement>
        <Input
          type="search"
          placeholder="Search"
          className={styles.searchInput}
          border="0"
        />
      </InputGroup>
      <Stack direction={["column", "row"]} spacing="24px">
        <Text fontSize="md" pt={2}>
          Hi, {user?.username}
        </Text>
        <Link to={"/settings"}>
          <Avatar variant="outline" name="Velsa" width="44px" height="44px">
            <AvatarBadge
              boxSize="12px"
              bg="#05C168"
              border="0"
              left="0"
              transform="unset"
            />
          </Avatar>
        </Link>
      </Stack>
    </Flex>
  );
}

export default Header;
