import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./Post.css";
import firebase from "firebase";

const Post = ({ userName, caption, imageUrl, postId, commentPoster }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            comment: doc.data(),
            commentId: doc.id,
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const addComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: comment,
      userName: commentPoster.displayName,
    });
    setComment("");
  };

  return (
    <div className="post">
      {/* header -> avatar & userName */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={userName}
          src="./assets/images/avatar/1.pnj"
        />
        <h3>{userName}</h3>
      </div>
      {/* image */}
      <img className="post__image" src={imageUrl} />
      {/* Owner caption */}
      <p className="post__text">
        <strong>{userName}:</strong> {caption}
      </p>
      {/* Guest caption */}
      {comments.map(({ comment, commentId }) => (
        <p key={commentId} className="post__text">
          <strong>{comment.userName}:</strong> {comment.text}
        </p>
      ))}
      {/* Add comment */}
      {commentPoster && (
        <form className="post__comment-box">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />
          <button
            className="post__enter-button"
            disabled={!comment}
            onClick={addComment}
            type="submit"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
