import { FC, memo, useState } from "react";

import { useComment } from "lib/CommentsStore";
import { useContract } from "lib/contractKit";
import { checkAuth } from "lib/contractMethods";
import { Comment as TComment } from "types/Comment";

import { Box, Button, Flex } from "@chakra-ui/react";

import Comment from "./Comment";

const CommentThread: FC<{ comments: TComment[] } & any> = ({
  comments,
  ...args
}) => {
  const { loadMore } = useComment();
  const { address } = useContract();
  const [showReplies, setShowReplies] = useState<boolean[]>(
    comments.map(() => true)
  );

  const toggleReplies = (idx: number) =>
    setShowReplies(s => s.map((r, i) => (i === idx ? !r : r)));

  return (
    <>
      {(comments as (TComment & { children: any[] })[]).map(
        ({ children = [], ...comment }, idx: number) => (
          <Box key={`${comment.childCommentsIdx}-${idx}`}>
            <Comment {...comment} {...args} />
            {children.length > 0 ? (
              <Button variant="link" onClick={() => toggleReplies(idx)}>
                {showReplies[idx]
                  ? "Hide replies"
                  : `Show ${children.length} ${
                      children.length > 1 ? "replies" : "reply"
                    }`}
              </Button>
            ) : (
              <Button
                variant="link"
                onClick={checkAuth(address, () =>
                  loadMore(comment.childCommentsIdx)
                )}
              >
                Load more
              </Button>
            )}

            {children && children.length > 0 && showReplies[idx] && (
              <Flex flexDir="row">
                <Box
                  alignSelf="stretch"
                  p={2}
                  cursor="pointer"
                  onClick={() => toggleReplies(idx)}
                >
                  <Box
                    w={1}
                    h="full"
                    bg="gray.500"
                    _hover={{ bg: "blue.500" }}
                  />
                </Box>
                <Flex flexDir="column">
                  <CommentThread comments={children} {...args} />
                </Flex>
              </Flex>
            )}
          </Box>
        )
      )}
    </>
  );
};

export default memo(CommentThread);
