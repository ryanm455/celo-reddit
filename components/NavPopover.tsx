import { FiSearch } from "react-icons/fi";

import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";

import CommunityView from "./CommunityView";

const NavPopover = () => (
  // adds a button the user can click to view the communities
  <Menu>
    <MenuButton
      as={Button}
      leftIcon={<Icon as={FiSearch} />}
      sx={{ "span.chakra-button__icon": { mr: { base: 0, sm: "0.5rem" } } }}
      variant="ghost"
      mr="auto"
    >
      <Box as="span" display={{ base: "none", sm: "block" }}>
        Explore
      </Box>
    </MenuButton>
    <MenuList>
      <CommunityView />
    </MenuList>
  </Menu>
);

export default NavPopover;
