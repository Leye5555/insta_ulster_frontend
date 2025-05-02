"use client";

import React, { useEffect } from "react";
import ImagePicker from "./ImagePicker";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const CreatePostModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedFile, setSelectedFile] = React.useState<
    Blob | null | undefined
  >();
  const [selectedFileUrl, setSelectedFileUrl] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const handleReset = () => {
    setSelectedFile(null);
    setSelectedFileUrl("");
    setCaption("");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFileUrl("");
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(selectedFile as Blob);
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") setSelectedFileUrl(dataUrl);
      console.log(dataUrl);
    };
  }, [selectedFile]);

  return (
    <div
      tabIndex={0}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 md:mx-0 flex flex-col items-center relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Title */}
        <div className="w-full border-b border-gray-200 py-4 flex justify-center">
          <span className="font-semibold text-lg">Create new post</span>
        </div>
        {/* Content */}
        {!caption &&
          (selectedFile ? (
            <div className=" border border-dashed border-gray-400 rounded-md relative min-w-full min-h-[max(500px,80vw)] flex-1 overflow-hidden">
              <button onClick={handleReset} className="relative z-10">
                <ArrowLeft color="white" size={30} />
              </button>
              <div className="w-full h-full absolute top-0 left-0 before:absolute before:w-full before:h-full before:bg-black before:opacity-50">
                <Image
                  src={selectedFileUrl}
                  alt="selected image"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover "
                />
              </div>
              <button
                onClick={() => {
                  setCaption(" ");
                }}
                className="absolute bottom-4 right-4 border border-white rounded-md px-4 py-2 text-white"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-16 px-4">
              <ImagePicker setSelectedFile={setSelectedFile} />
            </div>
          ))}

        {/* post input section */}
        {caption && (
          <div className="w-full border-t border-gray-200 p-4 flex justify-center flex-col gap-4">
            <textarea
              rows={4}
              cols={50}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full px-4 py-2"
            />

            <div className="flex gap-4">
              <button
                onClick={() => handleReset()}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex-[1]"
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex-[4]">
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
