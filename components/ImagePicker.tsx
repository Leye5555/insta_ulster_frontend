"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function ImagePicker({
  setSelectedFile,
}: {
  setSelectedFile: React.Dispatch<
    React.SetStateAction<Blob | null | undefined>
  >;
}) {
  const onDrop = useCallback(
    (acceptedFiles: Blob[]) => {
      // Do something with the files
      setSelectedFile(acceptedFiles[0]);
    },
    [setSelectedFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="mb-6 border border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center py-6">
          Drop files here ...
        </div>
      ) : (
        <div className="mb-6 border border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center ">
          <p className="text-center px-2">Drag and drop your image here</p>
          <svg width="70" height="70" fill="none" viewBox="0 0 70 70">
            <rect
              x="7"
              y="15"
              width="56"
              height="40"
              rx="6"
              stroke="#888"
              strokeWidth="2"
              fill="#fafafa"
            />
            <rect
              x="17"
              y="25"
              width="18"
              height="18"
              rx="4"
              stroke="#888"
              strokeWidth="2"
              fill="#fff"
            />
            <polygon points="45,35 55,40 45,45" fill="#888" />
          </svg>
        </div>
      )}

      <p className="block text-center px-5 py-2 bg-blue-500 text-white font-semibold rounded cursor-pointer hover:bg-blue-600 transition">
        Select From Computer
      </p>
    </div>
  );
}

export default ImagePicker;
