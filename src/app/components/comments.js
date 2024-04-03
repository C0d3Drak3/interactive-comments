"use client";
import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { useLocalStorage } from "./useLocalStorage";

const Comments = () => {
  const { getItem } = useLocalStorage("myData");
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
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          replyingTo={replyingTo}
          onReply={handleReply}
        />
      ))}
    </div>
  );
};

export default Comments;
