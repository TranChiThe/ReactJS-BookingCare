import React, { Component } from 'react';
import './Comment.scss';

class CommentSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentText: '',
            comments: [], // Array to store comments
            replyText: '',
            activeReplyId: null // Keeps track of the comment being replied to
        };
    }

    handleCommentChange = (event) => {
        this.setState({ commentText: event.target.value });
    }

    handleReplyChange = (event) => {
        this.setState({ replyText: event.target.value });
    }

    handleSubmitComment = () => {
        const { commentText, comments } = this.state;
        if (commentText.trim()) {
            const newComment = {
                id: comments.length + 1,
                text: commentText,
                user: 'User1', // Placeholder for the user's name
                timestamp: new Date().toLocaleString(),
                replies: [] // Initialize an empty array for replies
            };
            this.setState({
                comments: [...comments, newComment],
                commentText: ''
            });
        }
    }

    handleSubmitReply = (commentId) => {
        const { replyText, comments } = this.state;
        if (replyText.trim()) {
            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    const newReply = {
                        id: comment.replies.length + 1,
                        text: replyText,
                        user: 'User2', // Placeholder for the reply user's name
                        timestamp: new Date().toLocaleString()
                    };
                    return { ...comment, replies: [...comment.replies, newReply] };
                }
                return comment;
            });
            this.setState({
                comments: updatedComments,
                replyText: '',
                activeReplyId: null
            });
        }
    }

    toggleReplyBox = (commentId) => {
        this.setState({ activeReplyId: this.state.activeReplyId === commentId ? null : commentId });
    }

    render() {
        const { commentText, comments, replyText, activeReplyId } = this.state;

        return (
            <div className="comment-section">
                <h2>Comments</h2>
                <div className="comment-box">
                    <textarea
                        value={commentText}
                        onChange={this.handleCommentChange}
                        placeholder="Write a comment..."
                    />
                    <button onClick={this.handleSubmitComment}>Post Comment</button>
                </div>
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <div className="comment-user">{comment.user}</div>
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-timestamp">{comment.timestamp}</div>
                            <button onClick={() => this.toggleReplyBox(comment.id)}>Reply</button>

                            {/* Reply box for specific comment */}
                            {activeReplyId === comment.id && (
                                <div className="reply-box">
                                    <textarea
                                        value={replyText}
                                        onChange={this.handleReplyChange}
                                        placeholder="Write a reply..."
                                    />
                                    <button onClick={() => this.handleSubmitReply(comment.id)}>Post Reply</button>
                                </div>
                            )}

                            {/* Display replies */}
                            <div className="replies-list">
                                {comment.replies.map(reply => (
                                    <div key={reply.id} className="reply">
                                        <div className="reply-user">{reply.user}</div>
                                        <div className="reply-text">{reply.text}</div>
                                        <div className="reply-timestamp">{reply.timestamp}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default CommentSection;
