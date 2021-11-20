export type Comment = {
  idx: number;
  commenter: string;
  content: string;
  votes: number;
  timestamp: number;
  childCommentsIdx: number;
  parentCommentsIdx: number;
  voteState?: "upVoted" | "downVoted" | "none";
};
