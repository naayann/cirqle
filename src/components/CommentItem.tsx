import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { BiChevronUp } from "react-icons/bi";

interface Props {
  comment: Comment & {
    children: CommentNode[]
  };
  postId: number;
}

const createReply = async (
  replyContent: string, 
  postId: number, 
  parentCommentId: number, 
  userId?: string, 
  author?: string
) => {
  if (!userId || !author) {
      throw new Error("You must be logged in to reply.")
    }
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      content: replyContent,
      parent_comment_id: parentCommentId,
      user_id: userId,
      author: author,
    })
  
    if (error) throw new Error(error.message)
}

const CommentItem = ({ comment, postId }: Props) => {

  const [showReply, setShowReply] = useState<boolean>(false)
  const [replyText, setReplyText] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  const { user } = useAuth()
  const queryClient = useQueryClient()

    const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["comments", postId]})
            setReplyText("")
            setShowReply(false)
      }
  })

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText) return
    mutate(replyText)
  }

 return (
  <div className="mt-4">
    
    {/* Comment */}
    <div className="group">
      
      {/* Header */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-900">
          {comment.author}
        </span>
        <span className="text-gray-400">•</span>
        <span>
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>

      {/* Content */}
      <p className="mt-1 text-sm text-gray-800 leading-relaxed">
        {comment.content}
      </p>

      {/* Actions */}
      <div className="mt-2 flex items-center gap-4 opacity-70 group-hover:opacity-100 transition">
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="text-xs font-medium text-gray-500 hover:text-blue-600 transition"
        >
          {showReply ? "Cancel" : "Reply"}
        </button>

        {comment.children && comment.children.length > 0 && (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition"
          >
            <BiChevronUp
              className={`text-sm transition-transform duration-200 ${
                isCollapsed ? "" : "rotate-180"
              }`}
            />
            <span>
              {comment.children.length} repl
              {comment.children.length > 1 ? "ies" : "y"}
            </span>
          </button>
        )}
      </div>
    </div>

    {/* Reply box */}
    {showReply && user && (
      <form
        onSubmit={handleReplySubmit}
        className="mt-3 ml-5 relative"
      >
        {/* subtle connector line */}
        <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />

        <div className="pl-4">
          <textarea
            value={replyText}
            rows={2}
            placeholder="Write a reply..."
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          />

          <div className="mt-2 flex items-center gap-2">
            <button
              type="submit"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-black transition disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Reply"}
            </button>
          </div>

          {isError && (
            <p className="mt-1 text-xs text-red-500">
              Error posting reply
            </p>
          )}
        </div>
      </form>
    )}

    {/* Replies */}
    {comment.children && comment.children.length > 0 && isCollapsed && (
      <div className="mt-3 ml-5 relative">
        
        {/* vertical thread line */}
        <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />

        <div className="pl-4 space-y-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
            />
          ))}
        </div>
      </div>
    )}
  </div>
)
}

export default CommentItem
