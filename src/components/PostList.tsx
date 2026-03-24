import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import PostItem from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data as Post[]
}

const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading posts...</p>
    </div>
  )

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  )
}

export default PostList