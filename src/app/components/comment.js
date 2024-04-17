"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import testImg from "../../../images/avatars/image-amyrobson.png";
import scoreUp from "../../../images/icon-plus.svg";
import scoreDown from "../../../images/icon-minus.svg";
import replyArrow from "../../../images/icon-reply.svg";
import editIco from "../../../images/icon-edit.svg";
import deleteIco from "../../../images/icon-delete.svg";

const Comment = ({
  comment,
  currentUser,
  onReply,
  onSendReply,
  parentCommentId,
  onEditComment,
  onDeleteComment,
  onVoteComment,
}) => {
  const [replyText, setReplyText] = useState("");
  const userImg = "." + comment.user.image.png;
  const currentUserImg = currentUser.image.png;
  const currentUserImg2 = currentUserImg.substring(1);
  //arreglar para poder mostrar avatares correctamente

  const [isReplying, setIsReplying] = useState(false); //Reply, estado para manejar el cuadro de respuesta
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    // Verificar si el usuario actual ya votó por este comentario
    const userVote = currentUser.votes.find(
      (vote) => vote.commentId === comment.id
    );

    if (userVote) {
      if (userVote.voted === "up") {
        setUpvoted(true);
        setDownvoted(false);
      } else if (userVote.voted === "down") {
        setDownvoted(true);
        setUpvoted(false);
      }
    }
  }, [comment.id, currentUser.votes]);

  const handleUpvote = () => {
    if (!upvoted) {
      onVoteComment(comment.id, "up");
      setUpvoted(true);
      setDownvoted(false);
    }
  };

  const handleDownvote = () => {
    if (!downvoted) {
      onVoteComment(comment.id, "down");
      setDownvoted(true);
      setUpvoted(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = () => {
    console.log("Edicion del mensaje a:" + editedContent);
    // Llamar a la función proporcionada desde Comments para guardar la edición del comentario
    onEditComment(comment.id, editedContent);

    // Cerrar el cuadro de edición
    setEditing(false);
  };

  const handleDelete = () => {
    // Lógica para eliminar el comentario
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    // Llamar a la función proporcionada para eliminar el comentario
    onDeleteComment(comment.id);
    // Cerrar el modal después de confirmar el delete
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    // Cerrar el modal sin eliminar el comentario
    setShowModal(false);
  };

  const handleReply = () => {
    setIsReplying(true); //Reply , cambio el estado
    if (isReplying) {
      setIsReplying(false);
    }
    onReply(comment.id); //puede ser comment.user.username
    console.log("respondiendo al usuario: " + comment.user.username);
  };

  const handleSendReply = () => {
    // Crear la nueva respuesta
    const now = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const newReply = {
      id: Date.now(),
      content: replyText,
      createdAt: now,
      score: 0,
      replyingTo: comment.user.username,
      user: currentUser,
    };
    console.log("se crea la reply a:  " + newReply.replyingTo);
    // Llamar a la función proporcionada desde Comments para enviar la respuesta
    onSendReply(parentCommentId, newReply);

    // Limpiar el texto de la respuesta después de enviarla
    setReplyText("");
    // Cerrar el cuadro de respuesta
    setIsReplying(false);
  };

  return (
    <div className="  text-slate-500  my-2">
      <div className="bg-white rounded-lg grid grid-flow-col max-w-[750px]">
        <div className="grid grid-col bg-slate-100 w-9 h-[70px] content-center place-items-center justify-items-center rounded-lg mx-2 my-8 text-blue-600 font-bold">
          <button
            className=" w-5 h-5"
            onClick={handleUpvote}
            disabled={upvoted}
          >
            <Image
              src={scoreUp}
              alt="img not found"
              width={30}
              height={30}
              className=" w-4 h-auto"
            />
          </button>
          <span> {comment.score}</span>
          <button
            className=" w-5 h-5"
            onClick={handleDownvote}
            disabled={downvoted}
          >
            <Image
              src={scoreDown}
              alt="img not found"
              width={30}
              height={30}
              className=" w-4 h-auto"
            />
          </button>
        </div>
        <div className="p-3 max-w-[650px]">
          <div className="flex flex-row h-7">
            <Image
              src={testImg}
              alt="img not found"
              width={30}
              height={30}
              className="flex w-6 h-6 "
            />
            <span className=" text-black font-semibold ml-5">
              {comment.user.username}
            </span>
            {currentUser.username === comment.user.username ? (
              <div className=" bg-blue-600 text-white font-semibold rounded-md w-12 mx-3 text-center">
                you
              </div>
            ) : (
              <></>
            )}
            <span className="ml-5">{comment.createdAt}</span>
            {currentUser.username !== comment.user.username ? (
              <div className="  flex flex-row items-center place-self-end  h-7">
                <Image
                  src={replyArrow}
                  alt="img not found"
                  width={30}
                  height={30}
                  className="flex w-4 h-4 "
                />
                <button
                  className=" font-bold text-blue-600 h-7 "
                  onClick={handleReply}
                >
                  Reply
                </button>
              </div>
            ) : (
              <>
                <div className="  flex flex-row items-center place-self-end  h-7 mx-2">
                  <Image
                    src={deleteIco}
                    alt="img not found"
                    width={30}
                    height={30}
                    className="flex w-4 h-4 "
                  />
                  <button
                    className=" font-bold text-red-600 h-7 "
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  {/* Renderizar el modal de confirmación */}
                  {showModal && (
                    <div className="absolute z-10 border-2 border-black w-96 h-40">
                      <p>Are you sure you want to delete this comment?</p>
                      <button onClick={handleConfirmDelete}>Yes</button>
                      <button onClick={handleCancelDelete}>Cancel</button>
                    </div>
                  )}
                </div>
                <div className="  flex flex-row items-center place-self-end  h-7 mx-2">
                  <Image
                    src={editIco}
                    alt="img not found"
                    width={30}
                    height={30}
                    className="flex w-4 h-4 "
                  />
                  <button
                    className=" font-bold text-blue-600 h-7 "
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
          {editing ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className=" min-h-[100px] max-w-[550px] border-2 border-purple-800 rounded-lg"
              />
              <button
                className=" bg-blue-600 rounded-lg w-[90px] h-[40px] text-white"
                onClick={handleSaveEdit}
              >
                SAVE
              </button>
            </div>
          ) : (
            <div>
              <p>{comment.content}</p>
            </div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="bg-white rounded-lg grid grid-flow-col w-[750px] my-2 p-5">
          <div className="">
            <Image
              src={testImg}
              alt="img not found"
              width={50}
              height={50}
              className="w-10 h-auto"
            />
          </div>

          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Replying to ${comment.user.username}`}
            className=" min-h-[100px] w-[550px] border-2 border-purple-800 rounded-lg"
          />
          <button
            className=" bg-blue-600 rounded-lg w-[90px] h-[40px] text-white"
            onClick={handleSendReply}
          >
            REPLY
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
