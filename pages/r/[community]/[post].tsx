import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import CommentThread from "components/CommentThread";
import Markdown from "components/Markdown";
import ReplyBox from "components/ReplyBox";
import {
  CommentProvider,
  CommentStore,
} from "lib/CommentsStore";
import { useContract } from "lib/contractKit";
import {
  checkAuth,
  downVote,
  getVoteState,
  upVote,
} from "lib/contractMethods";
import { commentsFromArr } from "lib/contractResConv";
import { ssrContract } from "lib/ssrContract";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import {
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { Comment } from "types/Comment";
import { Post as TPost } from "types/Post";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

const AwardModal = dynamic(() => import("components/modals/AwardModal"));

type Props = {
  community: string;
  communityIdx: number;
  post: TPost;
  comments: Comment[];
};

const Post: React.FC<Props> = ({
  community,
  communityIdx,
  post: _post,
  comments,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [address, setAddress] = useState<string>();
  const { address: userAddress, kit } = useContract();

  // sets the address to send the award to and opens the modal
  const openAwardModal = (address: string) => (setAddress(address), onOpen());

  const [post, setPost] = useState(_post);

  // updates the post votes when user upvotes / downvotes
  const updatePostVote = (voteAmount: -1 | 1, voteState: TPost["voteState"]) =>
    setPost(p => ({ ...p, votes: p.votes + voteAmount, voteState }));

  const fetchPostVotes = useCallback(
    async () =>
      // fetches vote state from the blockchain to see if the user has upvoted or downvoted
      setPost({
        ...post,
        voteState: await getVoteState(kit as any, post.idx),
      }),
    [kit]
  );

  const _upVote = useCallback(async () => {
    if (post.voteState === "none") {
      // if not voted before
      await upVote(kit as any, post.childCommentsIdx);
      updatePostVote(1, "upVoted");
    }
  }, [kit, post.childCommentsIdx, post.voteState]);

  const _downVote = useCallback(async () => {
    if (post.voteState === "none") {
      // if not voted before
      await downVote(kit as any, post.childCommentsIdx);
      updatePostVote(-1, "downVoted");
    }
  }, [kit, post.childCommentsIdx, post.voteState]);

  useEffect(() => {
    // fetches what the user has voted when connected to wallet
    userAddress && fetchPostVotes();
  }, [userAddress]);

  return (
    <Container maxW="4xl" mt={3}>
      <Box
        p={3}
        bg={useColorModeValue("gray.50", "gray.900")}
        borderRadius="md"
      >
        <div>
          r/{community} • Posted by u/{post.address.substring(0, 10)}...{" "}
          {new Date(post.timestamp * 1000).toDateString()}
        </div>
        <Heading mb={2}>{post.title}</Heading>
        <Markdown>{post.content}</Markdown>
        <Flex gridGap={3} mt={3} alignItems="center">
          <Text fontWeight="bold" px={3}>
            {post.votes}
          </Text>
          <IconButton
            variant="ghost"
            aria-label="Up Vote"
            icon={<Icon as={FiChevronUp} />}
            onClick={checkAuth(kit, _upVote)}
            color={post.voteState === "upVoted" ? "red.600" : undefined}
          />
          <IconButton
            variant="ghost"
            aria-label="Down Vote"
            icon={<Icon as={FiChevronDown} />}
            onClick={checkAuth(kit, _downVote)}
            color={post.voteState === "downVoted" ? "blue.600" : undefined}
          />
          <Button
            variant="ghost"
            onClick={checkAuth(kit, () => openAwardModal(post.address))}
          >
            Award
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              navigator.share({ // opens share menu
                url: `${process.env.NEXT_PUBLIC_DOMAIN}/r/${communityIdx}/${post.idx}`,
              })
            }
          >
            Share
          </Button>
        </Flex>
      </Box>
      <Box
        p={3}
        bg={useColorModeValue("gray.50", "gray.900")}
        borderRadius="md"
        mt={4}
      >
        <CommentProvider
          postChildCommentsIdx={post.childCommentsIdx}
          comments={useMemo( // ensures all comments have a children array
            () => comments.map(e => ({ ...e, children: [] })),
            []
          )}
        >
          <Heading>Comments</Heading>
          <ReplyBox childCommentsIdx={post.childCommentsIdx} />

          {comments.length ? (
            <Box my={3}>
              <CommentStore.Consumer>
                {({ comments }) => (
                  <CommentThread
                    comments={comments}
                    openAwardModal={openAwardModal}
                  />
                )}
              </CommentStore.Consumer>
            </Box>
          ) : (
            <Text my={3}>There are no comments.</Text>
          )}
        </CommentProvider>
      </Box>
      <AwardModal
        isOpen={isOpen}
        onClose={onClose}
        address={address as string}
      />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const contract = await ssrContract();

  const [community, post] = await Promise.all([
    contract.methods.getCommunity(ctx.query.community).call(),
    contract.methods.getPost(ctx.query.post).call(),
  ]);

  if (!community.length || !post[1].length) { // ensure the post and community exists
    return { notFound: true };
  }

  const comments = await contract.methods.getComments(post[5]).call();

  return {
    props: {
      community,
      communityIdx: parseInt(ctx.query.community as string),
      comments: commentsFromArr(comments),
      post: {
        idx: parseInt(ctx.query.post as string),
        address: post[0],
        title: post[1],
        content: post[2],
        votes: post[3],
        timestamp: post[4],
        childCommentsIdx: post[5],
      },
    },
  };
};

export default Post;
