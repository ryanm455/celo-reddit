import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useContract } from "lib/contractKit";
import {
  checkAuth,
  downVote,
  upVote,
} from "lib/contractMethods";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { Post as TPost } from "types/Post";

import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Post: React.FC<
  TPost & {
    openAwardModal: (a: string) => void;
    community: string;
    communityIdx: number;
  }
> = ({ openAwardModal, community, communityIdx, ..._post }) => {
  const { kit } = useContract();
  const [post, setPost] = useState(_post);

  const updatePostVote = (voteAmount: -1 | 1, voteState: TPost["voteState"]) =>
    // updates the post vote value
    setPost(p => ({ ...p, votes: p.votes + voteAmount, voteState }));

  const _upVote = useCallback(async () => {
    if (post.voteState === "none") { // if not voted already
      await upVote(kit as any, post.childCommentsIdx);
      updatePostVote(1, "upVoted");
    }
  }, [kit, post.childCommentsIdx, post.voteState]);

  const _downVote = useCallback(async () => {
    if (post.voteState === "none") { // if not voted already
      await downVote(kit as any, post.childCommentsIdx);
      updatePostVote(-1, "downVoted");
    }
  }, [kit, post.childCommentsIdx, post.voteState]);

  useEffect(() => {
    // if the user is logged in, receive vote values from parent and update
    setPost(p => ({ ...p, voteState: _post.voteState }));
  }, [_post.voteState]);

  return (
    <Flex
      border="solid 1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderRadius="md"
      p={3}
      gridGap={3}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <Flex alignItems="center" flexDir="column" gridGap={1}>
        <IconButton
          variant="ghost"
          aria-label="Up Vote"
          icon={<Icon as={FiChevronUp} />}
          onClick={checkAuth(kit, _upVote)}
          color={post.voteState === "upVoted" ? "red.600" : undefined}
        />
        <Text fontWeight="bold">{post.votes.toString()}</Text>
        <IconButton
          variant="ghost"
          aria-label="Down Vote"
          icon={<Icon as={FiChevronDown} />}
          onClick={checkAuth(kit, _downVote)}
          color={post.voteState === "downVoted" ? "blue.600" : undefined}
        />
      </Flex>
      <div>
        <Text fontSize={{ base: "small", sm: "md" }}>
          r/{community} • Posted by u/{post.address.substring(0, 10)}...{" "}
          {new Date(post.timestamp * 1000).toDateString()}
        </Text>
        <Link href={`/r/${communityIdx}/${post.idx}`} passHref>
          <Heading as="a">{post.title}</Heading>
        </Link>
        <Flex gridGap={3} mt={3}>
          <Button
            variant="ghost"
            onClick={checkAuth(kit, () => openAwardModal(post.address))}
          >
            Award
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              navigator.share({
                url: `${process.env.NEXT_PUBLIC_DOMAIN}/r/${communityIdx}/${post.idx}`,
              })
            }
          >
            Share
          </Button>
        </Flex>
      </div>
    </Flex>
  );
};

export default Post;
