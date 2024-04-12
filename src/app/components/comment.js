"use client";

import Image from "next/image";
import React, { useState } from "react";
import testImg from "../../../images/avatars/image-amyrobson.png";
import scoreUp from "../../../images/icon-plus.svg";
import scoreDown from "../../../images/icon-minus.svg";
import replyArrow from "../../../images/icon-reply.svg";
import editIco from "../../../images/icon-edit.svg";
import deleteIco from "../../../images/icon-delete.svg";

const Comment = ({
  comment,
  currentUser,
  replyingTo,
  onReply,
  onSendReply,
}) => {
  const [replyText, setReplyText] = useState("");
  const userImg = "." + comment.user.image.png;
  const currentUserImg = currentUser.image.png;
  const currentUserImg2 = currentUserImg.substring(1);
  //arreglar para poder mostrar avatares correctamente

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = () => {
    // Lógica para guardar la edición del comentario
    setEditing(false);
  };

  const handleDelete = () => {
    // Lógica para eliminar el comentario
  };

  const handleReply = () => {
    onReply(comment.user.username);
    //corregir esto
  };

  /* const handleSendReply = () => {
    console.log("inicia el handleReply");
    const now = new Date().toISOString();
    const newReply = {
      id: Date.now(), // Id único
      content: replyText,
      createdAt: now,
      score: 0,
      user: currentUser,
    };

    // Obtener los comentarios actuales del localStorage
    const currentComments = JSON.parse(localStorage.getItem("myData")).comments;
    console.log("Primer paso, cargo los comentarios locales en una constante");
    // Buscar el comentario principal al que se responde
    const parentCommentIndex = currentComments.findIndex(
      (c) => c.id === comment.id
    );
    console.log("Segundo paso, cargo el comentario al que estoy respondiendo");

    if (parentCommentIndex !== -1) {
      // Si se encuentra el comentario principal
      // Agregar la nueva respuesta al array replies del comentario principal
      if (!currentComments[parentCommentIndex].replies) {
        currentComments[parentCommentIndex].replies = [newReply];
        console.log("Tercero paso, creo una nueva reply");
      } else {
        currentComments[parentCommentIndex].replies.push(newReply);
        console.log("Tercero, pusheo la nueva reply");
      }
    }

    // Actualizar los comentarios en el localStorage
    localStorage.setItem(
      "myData",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("myData")),
        comments: currentComments,
      })
    );

    // Limpiar el texto de la respuesta después de enviarla
    setReplyText("");
  }; */

  const handleSendReply = () => {
    // Crear la nueva respuesta
    const now = new Date().toISOString();
    const newReply = {
      id: Date.now(),
      content: replyText,
      createdAt: now,
      score: 0,
      user: currentUser,
    };

    // Llamar a la función proporcionada desde Comments para enviar la respuesta
    onSendReply(comment.id, newReply);

    // Limpiar el texto de la respuesta después de enviarla
    setReplyText("");
    // Cerrar el cuadro de respuesta
    onReply(null);
  };

  return (
    <div className="  text-slate-500  my-2">
      <div className="bg-white rounded-lg grid grid-flow-col max-w-[750px]">
        <div className="grid grid-col bg-slate-100 w-9 h-[70px] content-center place-items-center justify-items-center rounded-lg mx-2 my-8 text-blue-600 font-bold">
          <button className=" w-5 h-5">
            <Image
              src={scoreUp}
              alt="img not found"
              width={30}
              height={30}
              className=" w-4 h-auto"
            />
          </button>
          <span> {comment.score}</span>
          <button className=" w-5 h-5">
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

      {replyingTo === comment.user.username && (
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
            placeholder={`Replying to ${replyingTo}`}
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
