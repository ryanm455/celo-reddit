import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Comment } from "types/Comment";

import { useContract } from "./contractKit";
import { getVoteState } from "./contractMethods";
import { commentsFromArr } from "./contractResConv";

type TComment = Comment & { children: TComment[] };

type State = {
  comments: TComment[];
  loadMore: (childCommentsIdx: number) => Promise<void>;
  fetchVotes: (com?: TComment[]) => Promise<void>;
  refetchComments: () => Promise<void>;
};

// @ts-ignore
export const CommentStore = createContext<State>();

export const CommentProvider: React.FC<{
  comments: TComment[];
  postChildCommentsIdx: number;
}> = ({ children, comments: _comments, postChildCommentsIdx }) => {
  const { address, kit, contract } = useContract();
  const [comments, setComments] = useState<TComment[]>(_comments);

  const _fetchVotes = useCallback(
    async (com: TComment[]): Promise<TComment[]> =>
      Promise.all(
        com.map(async c => ({
          ...c,
          children:
            c.children && c.children.length
              ? await _fetchVotes(c.children)
              : [],
          voteState: await getVoteState(kit as any, c.parentCommentsIdx, c.idx),
        }))
      ),
    [kit]
  );

  const fetchVotes = useCallback(
    async (com: TComment[] = comments) => setComments(await _fetchVotes(com)),
    [kit]
  );

  const _updateChildComments = useCallback(
    (
      com: TComment[],
      children: TComment[],
      childCommentsIdx: number
    ): TComment[] =>
      com.map(c =>
        c.childCommentsIdx == childCommentsIdx
          ? {
              ...c,
              children,
            }
          : c.children.length
          ? {
              ...c,
              children: _updateChildComments(
                c.children,
                children,
                childCommentsIdx
              ),
            }
          : c
      ),
    []
  );

  const loadMore = async (childCommentsIdx: number) => {
    let _comments = await contract!.methods
      .getComments(childCommentsIdx)
      .call();

    if (!_comments.length) {
      return alert("Comment has no replies");
    }

    _comments = commentsFromArr(_comments);
    _comments = await _fetchVotes(_comments);

    setComments(c => _updateChildComments(c, _comments, childCommentsIdx));
  };

  const refetchComments = async () => {
    const comments = await _fetchVotes(
      commentsFromArr(
        await contract!.methods.getComments(postChildCommentsIdx).call()
      ) as TComment[]
    );
    setComments(comments);
  };

  useEffect(() => {
    address && fetchVotes();
  }, [address]);

  return (
    <CommentStore.Provider
      value={{
        comments,
        loadMore,
        fetchVotes,
        refetchComments,
      }}
    >
      {children}
    </CommentStore.Provider>
  );
};

export const useComment = () => useContext(CommentStore);
