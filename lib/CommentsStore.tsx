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
  // Allows the comments in a page to be managed in one place and prevent a lot of props being passed down to components.
  const { address, kit, contract } = useContract();
  const [comments, setComments] = useState<TComment[]>(_comments);

  const _fetchVotes = useCallback(
    async (com: TComment[]): Promise<TComment[]> =>
      // fetches all the votes in all the comments given
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
    // adds votes to all the comments and stores in in the useState hook
    async (com: TComment[] = comments) => setComments(await _fetchVotes(com)),
    [kit]
  );

  const _updateChildComments = useCallback(
    (
      com: TComment[],
      children: TComment[],
      childCommentsIdx: number
    ): TComment[] =>
      // finds where the comments needs to be updated and updates them with the new values fetched from the blockchain
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
    // loads children comments
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
    // refreshes the comments
    const comments = await _fetchVotes(
      commentsFromArr(
        await contract!.methods.getComments(postChildCommentsIdx).call()
      ) as TComment[]
    );
    setComments(comments);
  };

  useEffect(() => {
    // fetches what the user has voted when connected to wallet
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
