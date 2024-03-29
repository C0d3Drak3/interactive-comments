"use client";

import React, { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface Comment {
  id: number;
  content: string;
  createdAt: string; // Fecha en formato de cadena
  score: number;
  user: {
    image: string; // Ruta de la imagen del usuario
    username: string;
  };
  replies?: Comment[]; // Respuestas a este comentario
}

interface CommentItemProps {
  comment: Comment;
}

const Comments: React.FC = (comment) => {
  const { content, createdAt, score, user, replies } = comment;
  const { getItem } = useLocalStorage("myData");
  const data = getItem();

  if (!data || !data.comments) {
    return null;
  }

  return (
    <div className="comment-item">
      <div className="user-info">
        <img src={user.image} alt={user.username} className="user-avatar" />
        <span className="username">{user.username}</span>
      </div>
      <div className="comment-content">{content}</div>
      <div className="comment-details">
        <span className="created-at">{createdAt}</span>
        <span className="score">Score: {score}</span>
      </div>
      {replies && replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
