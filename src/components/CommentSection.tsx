import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment.")
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

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data as Comment[]
}

const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("")
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: comments, isLoading, error } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000
  })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name
      ),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["comments", postId]})
      }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText) return
    mutate({ content: newCommentText, parent_comment_id: null })
    setNewCommentText("")
  }

  type CommentNode = Comment & {
  children: CommentNode[]
}

const buildCommentTree = (
  flatComments: Comment[]
): CommentNode[] => {
  const map = new Map<number, CommentNode>()
  const roots: CommentNode[] = []

  flatComments.forEach((comment) => {
    map.set(comment.id, {
      ...comment,
      children: []
    })
  })

  flatComments.forEach((comment) => {
    const current = map.get(comment.id)
    if (!current) return

    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id)

      if (parent) {
        parent.children.push(current)
      }
    } else {
      roots.push(current)
    }
  })

  return roots
}

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading comments...</p>
    </div>
  )

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  const commentTree = comments ? buildCommentTree(comments) : []

  return (
    <div className="mt-10">

      <h3 className="text-[18px] font-semibold text-neutral-900 mb-4">
        Comments
      </h3>

      {/* Create Comments Section */}
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

      {/* Comments Display Section */}
      <div>
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId}/>
        ))}
      </div>
    </div>
  )
}

export default CommentSection
