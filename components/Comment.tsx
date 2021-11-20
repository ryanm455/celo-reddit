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
import {
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiCornerDownLeft,
} from "react-icons/fi";
import { Comment as TComment } from "types/Comment";

import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Markdown from "./Markdown";
import ReplyBox from "./ReplyBox";

const Comment: React.FC<TComment & { openAwardModal: (a: string) => void }> = ({
  openAwardModal,
  ..._comment
}) => {
  const { kit } = useContract();
  const [reply, setReply] = useState<boolean>(false);
  const [comment, setComment] = useState(_comment);

  // updates the comments vote value
  const updateCommentVote = (
    voteAmount: -1 | 1,
    voteState: TComment["voteState"]
  ) => setComment(c => ({ ...c, votes: c.votes + voteAmount, voteState }));

  const _upVote = useCallback(async () => {
    if (!comment.voteState || comment.voteState === "none") { // if not voted before
      await upVote(kit!, comment.parentCommentsIdx, comment.idx);
      updateCommentVote(1, "upVoted");
    }
  }, [comment.voteState, comment.parentCommentsIdx, comment.idx, kit]);

  const _downVote = useCallback(async () => {
    if (!comment.voteState || comment.voteState === "none") { // if not voted before
      await downVote(kit!, comment.parentCommentsIdx, comment.idx);
      updateCommentVote(-1, "downVoted");
    }
  }, [comment.voteState, comment.parentCommentsIdx, comment.idx, kit]);

  useEffect(() => {
    // updates from props whether upvoted or downvoted when connected to a wallet
    setComment(p => ({ ...p, voteState: _comment.voteState }));
  }, [_comment.voteState]);

  return (
    <Box w="full" p={2}>
      <Flex alignItems="center">
        <Text
          size="md"
          fontWeight="medium"
          color={useColorModeValue("gray.900", "gray.200")}
        >
          {comment.commenter}
        </Text>
      </Flex>
      <Box color={useColorModeValue("gray.800", "gray.300")}>
        <Markdown>{comment.content}</Markdown>
      </Box>
      <Flex alignItems="center" gridGap={1} mt={3}>
        <Text fontWeight="bold" mr={2}>
          {comment.votes.toString()}
        </Text>
        <IconButton
          variant="ghost"
          aria-label="Up Vote"
          icon={<Icon as={FiChevronUp} />}
          onClick={checkAuth(kit, _upVote)}
          color={comment.voteState === "upVoted" ? "red.600" : undefined}
        />

        <IconButton
          variant="ghost"
          aria-label="Down Vote"
          icon={<Icon as={FiChevronDown} />}
          onClick={checkAuth(kit, _downVote)}
          color={comment.voteState === "downVoted" ? "blue.600" : undefined}
        />
        <IconButton
          variant="ghost"
          aria-label="Reply"
          icon={<Icon as={FiCornerDownLeft} />}
          onClick={checkAuth(kit, () => setReply(r => !r))}
        />
        <IconButton
          variant="ghost"
          aria-label="Award"
          icon={<Icon as={FiAward} />}
          onClick={checkAuth(kit, () => openAwardModal(comment.commenter))}
        />
      </Flex>
      {reply && <ReplyBox childCommentsIdx={comment.childCommentsIdx} />}
    </Box>
  );
};

export default Comment;
