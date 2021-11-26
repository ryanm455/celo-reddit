// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Deddit {
    struct Comment {
        address payable commenter;
        string content;
        int votes;
        uint timestamp;
        uint childCommentsIdx;
        uint parentCommentsIdx;
    }
    
    struct Post {
        address payable poster;
        string title;
        string content;
        int votes;
        uint timestamp;
        uint commentsIdx;
        uint[] reportsIdx;
    }
    struct Report{
        address payable reporter;
        string content;
    }
    
    struct Community {
        string name;
        uint[] postsIdx;
    }
    
    mapping (uint => Community) internal communites;
    uint public communitesLen = 0;
    
    mapping (uint => Post) internal posts;
    uint public postsLen = 0;
    
    mapping (uint => Comment[]) internal comments;
    uint public commentsLen = 0;
    
    mapping (uint => Report) internal reports;
    uint public reportsLen  = 0;
    
    mapping(address => mapping(uint => bool)) internal upVoted;
    mapping(address => mapping(uint => bool)) internal downVoted;
    mapping(address => mapping(uint => mapping(uint => bool))) internal upVotedComments;
    mapping(address => mapping(uint => mapping(uint => bool))) internal downVotedComments;
    
    function createCommunity(string memory _name) public {
        // creates a new community
        Community storage newCommunity = communites[communitesLen];
        communitesLen++;
        newCommunity.name = _name;
    }
    
    function getCommunity(uint _idx) public view returns (
        string memory
    ) {
        // returns the community name from the index
        return (communites[_idx].name);
    }
    
    function getCommunityPosts(uint _idx) public view returns (uint[] memory) {
        // returns all of the posts in the community
        return (communites[_idx].postsIdx);
    }
    
    function createPost(uint _communityIdx, string memory _title, string memory _content) public {
        Post storage post = posts[postsLen];
        post.poster = payable(msg.sender);
        post.title = _title;
        post.content = _content;
        post.votes = 0;
        post.timestamp = block.timestamp;
        post.commentsIdx = commentsLen;
        
        communites[_communityIdx].postsIdx.push(postsLen);
        postsLen++;
        commentsLen++;
    }
    
    function createReport(uint _postsIdx, string memory _content) public{
        reports[reportsLen] = Report(
            payable(msg.sender),
            _content
        );
        posts[_postsIdx].reportsIdx.push(reportsLen);
        reportsLen++;
    }
    function getVoteState(uint _idx, int _commentIdx) public view returns (string memory _state) {
        if (_commentIdx < 0) { // if less than 0 it is a post
            // return votes for post
            if (upVoted[msg.sender][_idx]) {
                return "upVoted";
            } else if (downVoted[msg.sender][_idx]) {
                return "downVoted";
            }
        } else {
            // return votes for comment
            if (upVotedComments[msg.sender][_idx][uint(_commentIdx)]) {
                return "upVoted";
            } else if (downVotedComments[msg.sender][_idx][uint(_commentIdx)]) {
                return "downVoted";
            }
        }
        return "none";
    }
    
    function getPost(uint _idx) public view returns (
        address payable,
        string memory,
        string memory,
        int,
        uint,
        uint,
        uint[] memory
    ) {
        // returns the post from the index
        return (
            posts[_idx].poster,
            posts[_idx].title,
            posts[_idx].content,
            posts[_idx].votes,
            posts[_idx].timestamp,
            posts[_idx].commentsIdx,
            posts[_idx].reportsIdx
        );
    }
    
    function getReport(uint _idx) public view returns (
        address payable,
        string memory
    ){
        return (
            reports[_idx].reporter,
            reports[_idx].content
        );
    }
    
    function createComment(uint _idx, string memory _content) public {
        // creates a comment
        Comment memory _newComment = Comment(
             payable(msg.sender),
             _content,
             0,
             block.timestamp,
             commentsLen,
             _idx
        );
        comments[_idx].push(_newComment);
        commentsLen++;
    }
    
    function getComments(uint _idx) public view returns (Comment[] memory) {
        // returns the comment indexes from the childCommentIdx
        return comments[_idx];
    }
    
    function upVote(uint _idx, int _commentIdx) public payable {
        // upvotes a comment or a post
        if (_commentIdx < 0) { // if less than 0 it is a post
            require(upVoted[msg.sender][_idx] == false, "Already up voted");
            require(downVoted[msg.sender][_idx] == false, "Already down voted");
            require(posts[_idx].poster != address(0x0), "Index not valid");
            posts[_idx].votes++;
            upVoted[msg.sender][_idx] = true;
        } else {
            require(upVotedComments[msg.sender][_idx][uint(_commentIdx)] == false, "Already up voted");
            require(downVotedComments[msg.sender][_idx][uint(_commentIdx)] == false, "Already down voted");
            require(comments[_idx].length > uint(_commentIdx), "Index not valid");
            comments[_idx][uint(_commentIdx)].votes++;
            upVotedComments[msg.sender][_idx][uint(_commentIdx)] = true;
        }
    }
    
    function downVote(uint _idx, int _commentIdx) public payable {
        // downvotes a comment or a post
        if (_commentIdx < 0) { // if less than 0 it is a post
            require(downVoted[msg.sender][_idx] == false, "Already down voted");
            require(upVoted[msg.sender][_idx] == false, "Already up voted");
            require(posts[_idx].poster != address(0x0), "Index not valid");
            posts[_idx].votes--;
            downVoted[msg.sender][_idx] = true;
        } else {
            require(upVotedComments[msg.sender][_idx][uint(_commentIdx)] == false, "Already up voted");
            require(downVotedComments[msg.sender][_idx][uint(_commentIdx)] == false, "Already down voted");
            require(comments[_idx].length > uint(_commentIdx), "Index not valid");
            comments[_idx][uint(_commentIdx)].votes--;
            downVotedComments[msg.sender][_idx][uint(_commentIdx)] = true;
        }
    }
}