import { useState } from "react";

import { useContract } from "lib/contractKit";
import { checkAuth } from "lib/contractMethods";
import dynamic from "next/dynamic";
import { Post as TPost } from "types/Post";

import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import UserAvatar from "./Avatar";
import Post from "./Post";

const AwardModal = dynamic(() => import("components/modals/AwardModal"));
const CreatePostModal = dynamic(
  () => import("components/modals/CreatePostModal")
);

type Props = {
  msg?: string;
  posts: TPost[];
  communityIdx: number;
  community: string;
  updatePosts: () => Promise<void>;
};

const Community: React.FC<Props> = ({
  msg,
  posts,
  community,
  communityIdx,
  updatePosts: _updatePosts,
}) => {
  const { address: userAddress } = useContract();

  const {
    isOpen: isAwardOpen,
    onOpen: onAwardOpen,
    onClose: onAwardClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const [address, setAddress] = useState<string>();

  const openAwardModal = (address: string) => (
    setAddress(address), onAwardOpen()
  );

  const updatePosts = async () => (await _updatePosts(), onCreateClose());

  return (
    <>
      <Box bg={useColorModeValue("gray.50", "gray.900")} py={3} px={5}>
        <Container maxW="4xl" as={Flex} gridGap={4}>
          <Avatar name={community} />
          <Flex flexDir="column">
            <Heading>r/{community}</Heading>
            {msg && <Text>{msg}</Text>}
          </Flex>
        </Container>
      </Box>
      <Container as={Flex} gridGap={3} flexDir="column" maxW="4xl">
        <Flex
          mt={3}
          border="solid 1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          borderRadius="md"
          p={3}
          gridGap={3}
          bg={useColorModeValue("gray.50", "gray.900")}
          alignItems="center"
        >
          <UserAvatar address={userAddress as string | undefined} />
          <Input
            placeholder="Create post"
            w="full"
            onClick={checkAuth(userAddress, onCreateOpen)}
            as="input"
            cursor="pointer"
          />
        </Flex>
        {posts.map(p => (
          <Post
            community={community}
            communityIdx={communityIdx}
            {...p}
            key={p.idx}
            openAwardModal={openAwardModal}
          />
        ))}
        <AwardModal
          isOpen={isAwardOpen}
          onClose={onAwardClose}
          address={address as string}
        />
        <CreatePostModal
          isOpen={isCreateOpen}
          onClose={updatePosts}
          communityIdx={communityIdx}
        />
      </Container>
    </>
  );
};

export default Community;
