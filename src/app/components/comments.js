"use client";
import React, { useState, useEffect } from "react";
import Comment from "./comment.js";
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
    <div className="flex flex-col place-items-center">
      {comments.map((comment) => (
        <div className="flex flex-col  place-items-end">
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            replyingTo={replyingTo}
            onReply={handleReply}
          />
          {comment.replies.length > 1 ? (
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
                      onReply={handleReply}
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
