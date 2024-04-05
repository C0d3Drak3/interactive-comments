"use client";

import Image from "next/image";
import React, { useState } from "react";
import testImg from "../../../images/avatars/image-amyrobson.png";

const Comment = ({ comment, currentUser, replyingTo, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const userImg = "." + comment.user.image.png;
  const currentUserImg = currentUser.image.png;
  const currentUserImg2 = currentUserImg.substring(1);

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
  };

  const handleSendReply = () => {
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
  };

  return (
    <div className=" bg-white text-slate-500">
      <div>
        <Image
          src={testImg}
          alt="img not found"
          width={30}
          height={30}
          className="flex w-6"
        />
        <span className=" text-black font-semibold">
          {comment.user.username}
        </span>
        <span>{comment.createdAt}</span>
        <span> {comment.score}</span>
      </div>
      {editing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
        </div>
      ) : (
        <div>
          <p>{comment.content}</p>
          {currentUser.username === comment.user.username && (
            <>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
          <button onClick={handleReply}>Reply</button>
        </div>
      )}
      {replyingTo === comment.user.username && (
        <div>
          <div>
            <Image
              src={currentUserImg}
              alt="img not found"
              width={50}
              height={50}
            />
          </div>
          <div>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to ${replyingTo}`}
            />
            <button onClick={handleSendReply}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
