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
    
    mapping(address => mapping(uint => bool)) internal upVoted;
    mapping(address => mapping(uint => bool)) internal downVoted;
    mapping(address => mapping(uint => mapping(uint => bool))) internal upVotedComments;
    mapping(address => mapping(uint => mapping(uint => bool))) internal downVotedComments;
    
    function createCommunity(string memory _name) public {
        Community storage newCommunity = communites[communitesLen];
        communitesLen++;
        newCommunity.name = _name;
    }
    
    function getCommunity(uint _idx) public view returns (
        string memory
    ) {
        return (communites[_idx].name);
    }
    
    function getCommunityPosts(uint _idx) public view returns (uint[] memory) {
        return (communites[_idx].postsIdx);
    }
    
    function createPost(uint _communityIdx, string memory _title, string memory _content) public {
        posts[postsLen] = Post(
            payable(msg.sender),
            _title,
            _content,
            0,
            block.timestamp,
            commentsLen
        );
        
        communites[_communityIdx].postsIdx.push(postsLen);
        postsLen++;
        commentsLen++;
    }
    
    function getVoteState(uint _idx, int _commentIdx) public view returns (string memory _state) {
        if (_commentIdx < 0) {
            if (upVoted[msg.sender][_idx]) {
                return "upVoted";
            } else if (downVoted[msg.sender][_idx]) {
                return "downVoted";
            }
        } else {
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
        uint
    ) {
        return (
            posts[_idx].poster,
            posts[_idx].title,
            posts[_idx].content,
            posts[_idx].votes,
            posts[_idx].timestamp,
            posts[_idx].commentsIdx
        );
    }
    
    function createComment(uint _idx, string memory _content) public {
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
        return comments[_idx];
    }
    
    function upVote(uint _idx, int _commentIdx) public payable {
        if (_commentIdx < 0) {
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
        if (_commentIdx < 0) {
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