"use client";
import React, { useState, useEffect } from "react";
import Comment from "./comment.js";
import { useLocalStorage } from "./useLocalStorage";

const Comments = () => {
  const { getItem, setItem } = useLocalStorage("myData");
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const data = getItem();
    if (data) {
      setCurrentUser(data.currentUser);
      setComments(data.comments);
    }
  }, []); // <- Arreglo de dependencias vacío

  const [replyingTo, setReplyingTo] = useState(null);

  const handleReply = (username) => {
    setReplyingTo(username);
    console.log("respuesta a " + username);
  };

  const handleSendReply = (parentCommentId, newReply) => {
    // Find the parent comment
    console.log("Handle Send Reply to:" + parentCommentId);
    const parentComment = comments.find(
      (comment) => comment.id === parentCommentId
    );
    if (parentComment) {
      // Add the new reply to the parent comment's replies
      const updatedParentComment = {
        ...parentComment,
        replies: [...(parentComment.replies || []), newReply],
      };
      // Update the comments array with the modified parent comment
      const updatedComments = comments.map((comment) =>
        comment.id === parentCommentId ? updatedParentComment : comment
      );
      setComments(updatedComments);
      // Save the updated comments to localStorage
      setItem({ ...getItem(), comments: updatedComments });
    }
  };

  return (
    <div className="flex flex-col place-items-center">
      {comments.map((comment) => (
        <div className="flex flex-col  place-items-end">
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            replyingTo={replyingTo}
            parentCommentId={comment.id}
            onReply={handleReply}
            onSendReply={handleSendReply}
          />
          {comment.replies.length > 0 ? (
            <div className="flex  flex-col">
              {comment.replies.map((reply) => (
                <div className="flex flex-row">
                  <div className=" bg-slate-300 w-1 mx-5"></div>

                  <div className="w-[650px]">
                    <Comment
                      key={reply.id}
                      comment={reply}
                      currentUser={currentUser}
                      replyingTo={reply.replyingTo}
                      parentCommentId={comment.id}
                      onReply={handleReply}
                      onSendReply={handleSendReply}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
