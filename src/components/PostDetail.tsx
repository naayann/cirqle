import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import type { Post } from "./PostList";
import LikeButton from "./LikeButton";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message)

  return data as Post
}

const PostDetail = ({ postId }: Props) => {

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading post...</p>
    </div>
  )

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="pt-24 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="max-w-2xl mx-auto">

          {/* Title + Avatar */}
          <div className="flex items-start gap-3 mb-4">

            {data?.avatar_url ? (
              <img
                src={data.avatar_url}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0 mt-1"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium shrink-0 mt-1">
                {data?.title?.charAt(0).toUpperCase()}
              </div>
            )}

            <h2 className="text-[26px] font-semibold text-neutral-900 leading-snug">
              {data?.title}
            </h2>

          </div>

          {/* Image */}
          <div className="w-full aspect-4/3 overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              src={data?.image_url}
              alt={data?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="mt-5">
            <p className="text-[15.5px] leading-relaxed text-neutral-800 whitespace-pre-line">
              {data?.content}
            </p>
          </div>

          {/* Date */}
          <div className="mt-4">
            <span className="text-xs text-neutral-400">
              {new Date(data!.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <LikeButton postId={postId} />
        </div>

      </div>

    </div>
  )
}

export default PostDetail