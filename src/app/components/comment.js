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
    const userVote = currentUser.votes?.find(
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

  //VOTES
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

  //EDIT
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

  //DELETE
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

  //REPLY
  const handleReply = () => {
    if (isReplying) {
      setIsReplying(false);
    } else {
      setIsReplying(true);
    }
  };

  const handleSendReply = () => {
    // Crear la nueva respuesta
    const now = Date.now();
    /*new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); para publicar fecha de creacion sin timestamp*/
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

  //TIME
  const calculateTimeSincePost = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const timeDifference = now.getTime() - postTime.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  const timestamp = comment.createdAt; // Marca de tiempo del comentario o respuesta
  const timeSincePost = calculateTimeSincePost(timestamp);

  const width = comment.replyingTo ? "w-[700px]" : "w-[750px]";
  const width2 = comment.replyingTo ? "w-[650px]" : "w-[700px]";
  const width3 = comment.replyingTo ? "w-[626px]" : "w-[676px]";

  /*
  Blue tag in future replies, but not in the already replied comments 

  const [replyText, setReplyText] = useState(`@${comment.user.username ? comment.user.username : ""} `);
  
  const formattedContent = comment.content.replace(
    /^(@\w+)/,
    '<span class="text-blue-500 font-semibold ">$1</span>'
  );
  <p dangerouslySetInnerHTML={{ __html: formattedContent }}></p>; */

  return (
    <div className={` flex flex-col ${width} text-slate-500  my-2`}>
      <div className={`bg-white rounded-lg grid grid-flow-col ${width}`}>
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
        <div className={`p-3 ${width2}`}>
          <div className={`flex flex-row h-7 justify-between my-2 ${width3}`}>
            <div className="grid grid-flow-col h-7 justify-start items-center">
              <Image
                src={testImg}
                alt="img not found"
                width={30}
                height={30}
                className="flex w-7 h-7 "
              />
              <span className=" text-black font-semibold ml-5">
                {comment.user.username}
              </span>
              {currentUser.username === comment.user.username ? (
                <div className=" bg-blue-600 text-white font-semibold rounded w-12 mx-2 my-1 text-center">
                  you
                </div>
              ) : (
                <></>
              )}
              <span className="ml-5">{timeSincePost}</span>
            </div>
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
                  className=" font-bold text-blue-600 h-7 mx-2"
                  onClick={handleReply}
                >
                  Reply
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-flow-col h-7 justify-end ">
                  <div className="  flex flex-row items-center place-self-end  h-7 mx-2">
                    <Image
                      src={deleteIco}
                      alt="img not found"
                      width={30}
                      height={30}
                      className="flex w-4 h-4 "
                    />
                    <button
                      className=" font-bold text-red-600 h-7 ml-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    {/* Renderizar el modal de confirmación */}
                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center z-10 bg-black/50">
                        <div className=" bg-white rounded-lg  w-[400px] h-[270px] p-9">
                          <h1 className=" font-bold text-2xl text-gray-700">
                            Delete comment
                          </h1>
                          <p className=" my-6">
                            Are you sure you want to delete this comment? This
                            will remove this comment and can't be undone
                          </p>
                          <div className="flex flex-row justify-between">
                            <button
                              className=" bg-slate-400 rounded-lg w-[150px] h-[50px] text-white font-semibold transition-colors duration-300 filter  hover:bg-slate-600 "
                              onClick={handleCancelDelete}
                            >
                              NO, CANCEL
                            </button>
                            <button
                              className=" bg-red-400 rounded-lg w-[150px] h-[50px] text-white font-semibold transition-colors duration-300 filter  hover:bg-red-600"
                              onClick={handleConfirmDelete}
                            >
                              YES, DELETE
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="  flex flex-row items-center place-self-end  h-7 ml-4 mr-2">
                    <Image
                      src={editIco}
                      alt="img not found"
                      width={30}
                      height={30}
                      className="flex w-4 h-4 "
                    />
                    <button
                      className=" font-bold text-blue-600 h-7 ml-2 "
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/*EDIT */}
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
              <p>
                {comment.replyingTo ? (
                  <>
                    <span className="text-blue-500 font-semibold">
                      @{comment.replyingTo}
                    </span>{" "}
                    {comment.content}
                  </>
                ) : (
                  comment.content
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      {/*REPLY */}
      {isReplying && (
        <div
          className={`bg-white rounded-lg grid grid-flow-col my-2 p-5 ${width}`}
        >
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
