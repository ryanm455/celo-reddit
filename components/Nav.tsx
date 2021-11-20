import { useContract } from "lib/contractKit";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FiHome,
  FiLink,
  FiMoon,
  FiSun,
} from "react-icons/fi";

import {
  Flex,
  Heading,
  Icon,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import UserAvatar from "./Avatar";
import ButtonResponsive from "./ButtonResponsive";

const NavPopover = dynamic(() => import("./NavPopover"));

const ThemeSwitcher = () => {
  // allows user to switch between light and dark theme
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Theme Toggle"
      onClick={toggleColorMode}
      icon={<Icon as={colorMode === "light" ? FiMoon : FiSun} />}
      variant="ghost"
    />
  );
};

const Nav = () => {
  // displays the navigation menu
  const { address, connect } = useContract();

  return (
    <Flex
      px={5}
      py={4}
      gridGap={3}
      alignItems="center"
      pos="sticky"
      top={0}
      zIndex={1000}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Link href="/" passHref>
        <Heading as="a">deddit</Heading>
      </Link>
      <Link href="/" passHref>
        <ButtonResponsive
          leftIcon={<Icon as={FiHome} />}
          variant="ghost"
          as="a"
        >
          Home
        </ButtonResponsive>
      </Link>
      <NavPopover />

      <ThemeSwitcher />

      {address ? (
        <UserAvatar address={address} />
      ) : (
        <ButtonResponsive
          onClick={connect}
          variant="ghost"
          leftIcon={<Icon as={FiLink} />}
        >
          Connect Wallet
        </ButtonResponsive>
      )}
    </Flex>
  );
};

export default Nav;
