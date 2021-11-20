export type Post = {
  idx: number;
  address: string;
  title: string;
  content: string;
  votes: number;
  timestamp: number;
  childCommentsIdx: number;
  voteState?: "upVoted" | "downVoted" | "none";
};
