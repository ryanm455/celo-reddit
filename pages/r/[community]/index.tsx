import {
  useCallback,
  useEffect,
  useState,
} from "react";

import _Community from "components/Community";
import { useContract } from "lib/contractKit";
import {
  getPosts,
  getVoteState,
} from "lib/contractMethods";
import { postsFromArr } from "lib/contractResConv";
import { ssrContract } from "lib/ssrContract";
import { GetServerSideProps } from "next";
import { Post } from "types/Post";

type Props = {
  posts: Post[];
  communityIdx: number;
  community: string;
};

const Community: React.FC<Props> = ({ posts: _p, communityIdx, community }) => {
  const [posts, setPosts] = useState<Post[]>(_p);
  const { kit, address } = useContract();

  const getPostVoteState = useCallback(
    async (_posts: Post[] = posts) =>
      // gets whether the posts has been upvoted or downvoted
      setPosts(
        await Promise.all(
          _posts.map(async p => ({
            ...p,
            voteState: await getVoteState(kit as any, p.idx),
          }))
        )
      ),
    [kit, posts]
  );

  const updatePosts = async () => {
    // updates the posts
    const _posts = await getPosts(kit!, communityIdx);
    await getPostVoteState(_posts);
  };

  useEffect(() => {
    // fetches what the user has voted when connected to wallet
    address && getPostVoteState();
  }, [address]);

  useEffect(() => {
    // if on a new community change the posts
    address ? getPostVoteState(_p) : setPosts(_p);
  }, [_p])

  return (
    <_Community
      posts={posts}
      communityIdx={communityIdx}
      community={community}
      updatePosts={updatePosts}
    />
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const contract = await ssrContract();

  const community = await contract.methods
    .getCommunity(ctx.query.community)
    .call();

  if (!community.length) { // ensures the community exists
    return { notFound: true };
  }

  const postsIdx: number[] = await contract.methods
    .getCommunityPosts(ctx.query.community)
    .call();

  const posts = await postsFromArr(postsIdx, contract);

  return {
    props: {
      posts,
      community,
      communityIdx: parseInt(ctx.query.community as string),
    },
  };
};

export default Community;
