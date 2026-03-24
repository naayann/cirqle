import React, { useState, type ChangeEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "../supabase-client";

interface PostInput {
  title: string;
  content: string;
}

const createPost = async (post: PostInput, imageFile: File) => {

  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`

  const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, imageFile)

  if (uploadError) throw new Error(uploadError.message)

  const { data: publicURLData } = supabase.storage.from("post-images").getPublicUrl(filePath)

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl })

  if (error) throw new Error(error.message)

  return data;
}

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile)
    },
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedFile) return
    mutate({ post: { title, content }, imageFile: selectedFile })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 px-6">
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            onChange={(event) => setTitle(event.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white/80 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            placeholder="Give your post a title..."
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Content
          </label>
          <textarea
            id="content"
            required
            rows={5}
            onChange={(event) => setContent(event.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white/80 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            placeholder="Share your thoughts..."
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Upload Image
          </label>

          <input
            type="file"
            id="image"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="text-sm text-neutral-600 file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-neutral-900 file:text-white file:cursor-pointer hover:file:bg-neutral-800 transition"
          />

          {selectedFile && (
            <p className="text-xs text-neutral-500 mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-linear-to-r from-violet-500 to-indigo-500 text-white font-medium shadow-md hover:shadow-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Creating...
            </span>
          ) : (
            "Create Post"
          )}
        </button>

        {isError && (
          <p className="text-sm text-red-500 mt-2">
            Error creating post
          </p>
        )}
      </div>
    </form>
  )
}

export default CreatePost