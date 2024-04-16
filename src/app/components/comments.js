"use client";
import React, { useState, useEffect } from "react";
import Comment from "./comment.js";
import { useLocalStorage } from "./useLocalStorage";

const Comments = () => {
  const { getItem, setItem } = useLocalStorage("myData");
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const data = getItem();
    if (data) {
      setCurrentUser(data.currentUser);
      setComments(data.comments);
    }
  }, []);

  const handleEditComment = (commentId, editedContent) => {
    // Buscar el comentario en el array de comentarios
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        // Si se encuentra el comentario, actualizar su contenido
        return {
          ...comment,
          content: editedContent,
        };
      } else if (comment.replies) {
        // Si el comentario tiene respuestas, buscar en ellas
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === commentId) {
            // Si se encuentra el comentario dentro de las respuestas, actualizar su contenido
            return {
              ...reply,
              content: editedContent,
            };
          }
          return reply;
        });
        // Devolver el comentario actualizado con las respuestas actualizadas
        return {
          ...comment,
          replies: updatedReplies,
        };
      }
      return comment;
    });

    // Actualizar el estado de los comentarios con los comentarios actualizados
    setComments(updatedComments);

    // Guardar los comentarios actualizados en el localStorage
    setItem({
      ...getItem(),
      comments: updatedComments,
    });
  };

  const handleDeleteComment = (commentId) => {
    // Find the comment to delete
    const updatedComments = comments
      .map((comment) => {
        if (comment.id === commentId) {
          // If the comment matches the ID, return null to mark it for deletion
          return null;
        } else if (comment.replies) {
          // Check if the comment has replies and search for the comment to delete
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              // If the reply matches the ID, return null to mark it for deletion
              return null;
            }
            return reply;
          });
          // Return the comment with updated replies
          return {
            ...comment,
            replies: updatedReplies.filter((reply) => reply !== null),
          };
        }
        return comment;
      })
      .filter((comment) => comment !== null); // Remove marked comments

    // Update the comments state and save to localStorage
    setComments(updatedComments);
    setItem({ currentUser, comments: updatedComments });
  };

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
            parentCommentId={comment.id}
            onReply={handleReply}
            onSendReply={handleSendReply}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
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
                      parentCommentId={comment.id}
                      onReply={handleReply}
                      onSendReply={handleSendReply}
                      onEditComment={handleEditComment}
                      onDeleteComment={handleDeleteComment}
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
