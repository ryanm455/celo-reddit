// converts the arrays returned from the contract to objects
import { Comment } from "types/Comment";
import { Post } from "types/Post";

export const postsFromArr = async (
  posts: number[],
  contract: any
): Promise<Post[]> => {
  const _posts = [];
  for (let post in posts) {
    _posts.push(
      new Promise(async res => {
        let p = await contract.methods.getPost(posts[post]).call();
        res({
          idx: parseInt(post),
          address: p[0],
          title: p[1],
          content: p[2],
          votes: parseInt(p[3]),
          timestamp: parseInt(p[4]),
          childCommentsIdx: parseInt(p[5]),
        } as Post);
      })
    );
  }
  return (await Promise.all(_posts)) as Post[];
};

export const commentsFromArr = (comments: (string | number)[][]): Comment[] =>
  comments.map((c: (string | number)[], idx: number) => ({
    idx,
    commenter: c[0] as string,
    content: c[1] as string,
    votes: parseInt(c[2] as string),
    timestamp: parseInt(c[3] as string),
    childCommentsIdx: parseInt(c[4] as string),
    parentCommentsIdx: parseInt(c[5] as string),
  }));
