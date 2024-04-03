"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "./components/useLocalStorage";
import Comments from "./components/comments";

export default function Home() {
  const { getItem, setItem } = useLocalStorage("myData");

  useEffect(() => {
    // Verificar si los datos ya existen en el localStorage
    const existingData = getItem();

    if (!existingData) {
      // Si los datos no existen en el localStorage, cargarlos desde el JSON
      fetch("../../public/data.json") // Ruta del archivo JSON
        .then((response) => response.json())
        .then((data) => {
          // Almacenar los datos en el localStorage
          setItem(data);
          console.log("Data loaded correctly");
        })
        .catch((error) => {
          console.error("Error fetching or storing data:", error);
        });
    }
  }, [getItem, setItem]); // Dependencias del useEffect

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-100">
      <div className="w-full items-center justify-center">
        <Comments />
      </div>
      {/*Footer*/}
      <div className="mt-auto mb-4 text-[11px] md:text-[16px] w-[290px] md:w-[430px] place-self-center text-black ">
        Challenge by{" "}
        <a
          href="https://www.frontendmentor.io?ref=challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Martín Otero
        </a>
        .
      </div>
    </main>
  );
}
