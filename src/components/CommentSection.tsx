import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) {
    throw new Error("You must be loged in to comment.")
  }
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  })

  if (error) throw new Error(error.message)
}

const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("")
  const { user } = useAuth()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText) return
    mutate({ content: newCommentText, parent_comment_id: null })
    setNewCommentText("")
  }

  return (
    <div className="mt-10">

      <h3 className="text-[18px] font-semibold text-neutral-900 mb-4">
        Comments
      </h3>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border border-neutral-200 bg-white p-4"
        >

          <textarea
            value={newCommentText}
            rows={3}
            placeholder="Write a comment..."
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full resize-none text-[14px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
          />

          <div className="flex items-center justify-between">

            <span className="text-xs text-neutral-400">
              Share your thoughts
            </span>

            <button
              type="submit"
              disabled={!newCommentText}
              className={`px-4 py-1.5 text-sm font-medium transition active:scale-[0.97] ${newCommentText
                  ? "bg-linear-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600"
                  : "bg-neutral-200 text-neutral-400 rounded-xs cursor-not-allowed"
                }`}
            >
              {isPending ? "Posting..." : "Post"}
            </button>

          </div>

          {isError && (
            <p className="text-xs text-red-500">
              Error posting comment
            </p>
          )}

        </form>
      ) : (
        <p className="text-sm text-neutral-500 border border-neutral-200 p-4 bg-white">
          You must be logged in to post a comment
        </p>
      )}

    </div>
  )
}

export default CommentSection
