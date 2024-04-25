"use client";
import React, { useState, useEffect } from "react";
import Comment from "./comment.js";
import NewComment from "./newComment.js";
import { useLocalStorage } from "./useLocalStorage";

const Comments = () => {
  const { getItem, setItem } = useLocalStorage("myData");
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const data = getItem();
    if (data) {
      setCurrentUser(data.currentUser);
      const sortedComments = data.comments.sort((a, b) => b.score - a.score);
      setComments(sortedComments);
    }
  }, []);

  const handleAddComment = (newCommentPost) => {
    // Copiar el array de comentarios actual para evitar mutar el estado directamente
    const updatedComments = [...comments, newCommentPost];

    // Actualizar el estado de los comentarios
    setComments(updatedComments);

    // Guardar los cambios en el localStorage
    setItem({ ...getItem(), comments: updatedComments });
  };

  const handleVoteComment = (commentId, voteType) => {
    // Verificar si el usuario actual ha votado por el comentario principal
    const currentUserVotes = currentUser.votes || [];
    const existingVote = currentUserVotes.find(
      (vote) => vote.commentId === commentId
    );

    // Función para actualizar los votos en el comentario principal y sus respuestas
    const updateVotes = (comments) => {
      return comments.map((comment) => {
        // Verificar si el comentario actual es el comentario principal
        if (comment.id === commentId) {
          // Determinar el incremento o decremento del puntaje del comentario
          let scoreChange = 0;
          if (!existingVote) {
            // Si el usuario no ha votado antes por este comentario, aplicar +1 o -1
            scoreChange = voteType === "up" ? 1 : -1;
          } else if (existingVote.voted !== voteType) {
            // Si el usuario cambia su voto, aplicar +2 o -2
            scoreChange = voteType === "up" ? 2 : -2;
          }
          // Actualizar el voto del comentario principal
          const updatedComment = {
            ...comment,
            score: comment.score + scoreChange,
          };
          return updatedComment;
        }
        // Verificar si el comentario actual tiene respuestas
        if (comment.replies && comment.replies.length > 0) {
          // Actualizar el voto en las respuestas correspondientes
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              // Actualizar el voto de la respuesta
              let scoreChange = 0;
              if (!existingVote) {
                // Si el usuario no ha votado antes por este comentario, aplicar +1 o -1
                scoreChange = voteType === "up" ? 1 : -1;
              } else if (existingVote.voted !== voteType) {
                // Si el usuario cambia su voto, aplicar +2 o -2
                scoreChange = voteType === "up" ? 2 : -2;
              }
              return {
                ...reply,
                score: reply.score + scoreChange,
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
        // Devolver el comentario sin cambios si no es el comentario principal ni tiene respuestas
        return comment;
      });
    };

    // Actualizar los votos en los comentarios y respuestas
    const updatedComments = updateVotes(comments);

    // Actualizar el voto del usuario en el array de votos del currentUser
    let updatedUserVotes;
    if (!existingVote) {
      updatedUserVotes = [...currentUserVotes, { commentId, voted: voteType }];
    } else {
      // Si el usuario ya ha votado, actualizar su voto
      updatedUserVotes = currentUserVotes.map((vote) =>
        vote.commentId === commentId ? { ...vote, voted: voteType } : vote
      );
    }

    // Actualizar el estado de los comentarios y el currentUser
    setComments(updatedComments);
    setCurrentUser({ ...currentUser, votes: updatedUserVotes });

    // Guardar los cambios en el localStorage
    setItem({
      ...getItem(),
      comments: updatedComments,
      currentUser: { ...currentUser, votes: updatedUserVotes },
    });
  };

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
    <div className="flex flex-col w-[700px] place-items-center">
      {comments.map((comment) => (
        <div className="">
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            parentCommentId={comment.id}
            onSendReply={handleSendReply}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onVoteComment={handleVoteComment}
          />
          {comment.replies.length > 0 ? (
            <div className="flex  flex-col ">
              {comment.replies.map((reply) => (
                <div className="flex flex-row justify-evenly">
                  <div className=" bg-slate-300 w-1 mx-5"></div>

                  <div className="w-[700px]">
                    <Comment
                      key={reply.id}
                      comment={reply}
                      currentUser={currentUser}
                      parentCommentId={comment.id}
                      onSendReply={handleSendReply}
                      onEditComment={handleEditComment}
                      onDeleteComment={handleDeleteComment}
                      onVoteComment={handleVoteComment}
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
      <NewComment currentUser={currentUser} onAddComment={handleAddComment} />
    </div>
  );
};

export default Comments;
