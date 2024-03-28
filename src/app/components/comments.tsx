"use client";

import React, { useState, useEffect } from "react";
import data from "../../../data.json";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  replies: Comment[];
  canEdit?: boolean; // Agregamos canEdit como una propiedad opcional
}

interface User {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Función recursiva para cargar comentarios del JSON y establecer la propiedad canEdit
    const loadComments = (
      comments: Comment[],
      currentUser: User | null
    ): Comment[] => {
      return comments.map((comment) => ({
        ...comment,
        replies: loadComments(comment.replies, currentUser),
        canEdit: currentUser
          ? comment.user.username === currentUser.username
          : false,
      }));
    };

    const adaptedComments: Comment[] = [];

    data.comments.forEach((comment) => {
      const adaptedComment: Comment = {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        score: comment.score,
        user: comment.user,
        replies: [],
      };

      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          const adaptedReply: Comment = {
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            score: reply.score,
            user: reply.user,
            replies: [],
          };
          adaptedComment.replies.push(adaptedReply);
        });
      }

      adaptedComments.push(adaptedComment);
    });

    setComments(adaptedComments);
    setCurrentUser(data.currentUser);
  }, []);

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentText = e.currentTarget.commentText.value;
    if (!commentText.trim() || !currentUser) return;
    const newComment: Comment = {
      id: Date.now(),
      content: commentText,
      createdAt: new Date().toISOString(),
      score: 0,
      user: currentUser,
      replies: [],
      canEdit: true,
    };
    setComments([...comments, newComment]);
    e.currentTarget.reset();
  };

  const handleCommentDelete = (commentId: number, replyId?: number) => {
    if (currentUser) {
      setComments((prevComments) => {
        const updatedComments = prevComments
          .map((comment) => {
            if (comment.user.username === currentUser.username) {
              if (replyId !== undefined) {
                // Eliminar respuesta específica
                return {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply.id !== replyId
                  ),
                };
              } else {
                // Eliminar comentario principal
                return null;
              }
            }
            return comment;
          })
          .filter(
            (comment): comment is Comment => comment !== null
          ) as Comment[];
        return updatedComments; // Devolver el nuevo arreglo de comentarios
      });
    }
  };

  const handleCommentEdit = (
    commentId: number,
    newText: string,
    replyId?: number
  ) => {
    if (currentUser) {
      setComments((prevComments) => {
        const updatedComments = prevComments.map((comment) => {
          if (comment.user.username === currentUser.username) {
            if (replyId !== undefined) {
              // Editar respuesta específica
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply.id === replyId) {
                    return { ...reply, content: newText };
                  }
                  return reply;
                }),
              };
            } else {
              // Editar comentario principal
              return { ...comment, content: newText };
            }
          }
          return comment;
        });
        return updatedComments; // Devolver el nuevo arreglo de comentarios
      });
    }
  };

  return (
    <div className="text-black">
      <h2>Comentarios</h2>
      <ul>
        {currentUser &&
          renderComments(
            comments,
            handleCommentDelete,
            handleCommentEdit,
            currentUser
          )}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea name="commentText" />
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
};

const renderComments = (
  comments: Comment[],
  handleCommentDelete: (commentId: number, replyId?: number) => void,
  handleCommentEdit: (
    commentId: number,
    newText: string,
    replyId?: number
  ) => void,
  currentUser: { username: string }
) => {
  return (
    <>
      {comments.map((comment) => (
        <li key={comment.id}>
          <div>{comment.content}</div>
          <div>Usuario: {comment.user.username}</div>
          {comment.user.username === currentUser.username && ( // Mostrar botones solo si el comentario es del usuario actual
            <>
              <button onClick={() => handleCommentDelete(comment.id)}>
                Eliminar
              </button>
              <button
                onClick={() => handleCommentEdit(comment.id, "Nuevo texto")}
              >
                Editar
              </button>
            </>
          )}
          {comment.replies.length > 0 &&
            renderComments(
              comment.replies,
              handleCommentDelete,
              handleCommentEdit,
              currentUser
            )}
        </li>
      ))}
    </>
  );
};

export default Comments;
