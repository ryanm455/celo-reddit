import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Community from "components/Community";
import { useContract } from "lib/contractKit";
import {
  getPosts,
  getVoteState,
} from "lib/contractMethods";
import { postsFromArr } from "lib/contractResConv";
import { ssrContract } from "lib/ssrContract";
import { GetStaticProps } from "next";
import { Post } from "types/Post";

type Props = {
  posts: Post[];
  communityIdx: number;
  community: string;
};

const Index: React.FC<Props> = ({ posts: _p, communityIdx, community }) => {
  const [posts, setPosts] = useState<Post[]>(_p);
  const { kit, address } = useContract();

  const getPostVoteState = useCallback(
    async (_posts: Post[] = posts) =>
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
    const _posts = await getPosts(kit!, communityIdx);
    await getPostVoteState(_posts);
  };

  useEffect(() => {
    address && getPostVoteState();
  }, [address]);

  useEffect(() => {
    address ? getPostVoteState(_p) : setPosts(_p);
  }, [_p])

  return (
    <Community
      msg="Welcome 👋, tap the explore button to browse the other subs!"
      posts={posts}
      communityIdx={communityIdx}
      community={community}
      updatePosts={updatePosts}
    />
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const contract = await ssrContract();

  // 0 is r/announcements
  const postsIdx: number[] = await contract.methods.getCommunityPosts(0).call();

  const posts = await postsFromArr(postsIdx, contract);

  return {
    props: {
      posts,
      communityIdx: 0,
      community: "announcements",
    },
  };
};

export default Index;
