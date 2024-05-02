"use client";

import React, { useState } from "react";
import Image from "next/image";
import testImg from "../../../images/avatars/image-amyrobson.png";

const NewComment = ({ onAddComment, currentUser }) => {
  const [newComment, setNewComment] = useState("");

  const handleNewComment = () => {
    const now = Date.now();
    /*new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }); para publicar fecha de creacion sin timestamp */
    const newCommentPost = {
      id: Date.now(),
      content: newComment,
      createdAt: now,
      score: 0,
      user: currentUser,
      replies: [],
    };
    // Verificar si el comentario no está vacío antes de agregarlo
    if (newComment.trim() !== "") {
      // Llamar a la función onAddComment y pasarle el nuevo comentario
      onAddComment(newCommentPost);
      // Limpiar el estado después de agregar el comentario
      setNewComment("");
    }
  };

  return (
    <div className="bg-white rounded-lg grid grid-flow-col justify-between w-[750px] my-2 p-5 text-slate-500 ">
      <div className="">
        {/* Asegúrate de tener la ruta correcta a tu imagen y que testImg esté definido */}
        <Image
          src={testImg} // Reemplaza testImg con la variable que contiene la ruta de la imagen
          alt="img not found"
          width={50}
          height={50}
          className="w-10 h-auto"
        />
      </div>

      <textarea
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder={`New post here`}
        maxLength={300}
        className="min-h-[100px] w-[550px] border-2 border-blue-600 rounded-lg p-1 "
        style={{ resize: "none" }}
      />
      <button
        className="bg-blue-600 rounded-lg w-[90px] h-[40px] text-white transition-colors duration-300 filter  hover:bg-blue-300 "
        onClick={handleNewComment}
      >
        SEND
      </button>
    </div>
  );
};

export default NewComment;
