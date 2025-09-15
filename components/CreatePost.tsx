"use client";

import React, { useCallback, useEffect } from "react";
import ImagePicker from "./ImagePicker";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/lib/definitions/schema";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";
import { createPost } from "@/services/redux/slices/postSlice";
import Cookies from "universal-cookie";
import { z } from "zod";
import { cn } from "@/lib/utils";
const cookies = new Cookies(null, { path: "/" });

const CreatePostModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedFile, setSelectedFile] = React.useState<
    Blob | null | undefined
  >();
  const [selectedFileUrl, setSelectedFileUrl] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const dispatch = useAppDispatch();
  const postState = useAppSelector((state) => state.posts);

  const [isLoading, setIsLoading] = React.useState(false);
  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setSelectedFileUrl("");
    setCaption("");
  }, []);

  const onSubmit = (data: z.infer<typeof postSchema>) => {
    setIsLoading(true);
    console.log(data);
    dispatch(
      createPost({
        content: data.content,
        token: cookies.get("AUTH"),
        post_image: selectedFile as File,
      })
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
  });

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

  useEffect(() => {
    console.log(postState.status);
    if (postState.status === "succeeded") {
      setIsLoading(false);
      handleReset();
      onClose();
    }
    if (postState.status === "failed") {
      setIsLoading(false);
    }
  }, [postState.status, onClose, handleReset]);

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 md:mx-0 flex flex-col items-center relative"
      >
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
            <div className=" border border-dashed border-gray-400 rounded-md relative min-w-full min-h-[max(500px,80vh)] max-h-[60vh] flex-1 overflow-hidden">
              <button onClick={handleReset} className="relative z-10">
                <ArrowLeft color="white" size={30} />
              </button>
              <div className="w-full h-full absolute top-0 left-0 before:absolute before:w-full before:h-full before:bg-black before:opacity-50">
                <Image
                  src={selectedFileUrl}
                  alt="selected image"
                  width={200}
                  height={200}
                  className="w-full h-full  object-cover "
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
            <div className="flex flex-col gap-1 mt-2">
              <label
                className="text-sm text-gray-600 font-medium"
                htmlFor="caption"
              >
                Caption
              </label>
              <textarea
                rows={4}
                cols={50}
                required
                {...register("content")}
                placeholder="Write a caption..."
                className="w-full px-4 py-2"
              />
              {errors.content && (
                <span className="text-red-500 text-sm">
                  {errors.content.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label
                className="text-sm text-gray-600 font-medium"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                {...register("tags")}
                placeholder="Add tags, separated by commas (e.g. travel,food,fun)"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-xs text-gray-500">
                Tags help others discover your post.
              </span>
            </div>
            {/* Advanced Image Details Section */}
            <div className="w-full">
              <details className="w-full border rounded-md">
                <summary className="px-4 py-2 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                  Advanced Image Details
                </summary>
                <div className="px-4 py-3 flex flex-col gap-3 border-t">
                  {/* Title field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Title</label>
                    <input
                      type="text"
                      {...register("imageTitle")}
                      placeholder="Add a title for this image"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  {/* Location field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Location</label>
                    <input
                      type="text"
                      {...register("imageLocation")}
                      placeholder="Add a location"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  {/* Alt Text field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Alt Text</label>
                    <textarea
                      rows={2}
                      {...register("imageAlt")}
                      placeholder="Describe this image for vision-impaired people"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <span className="text-xs text-gray-500">
                      Good alt text is concise, descriptive, and under 125
                      characters
                    </span>
                  </div>
                </div>
              </details>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleReset()}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex-[1]"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                className={cn(
                  "bg-blue-500 text-white px-4 py-2 rounded-md flex-[4]",
                  isLoading && "opacity-50"
                )}
              >
                {isLoading ? "Loading..." : "Post"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePostModal;
