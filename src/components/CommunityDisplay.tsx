import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import type { Post } from "./PostList";
import PostItem from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  }
}

const fetchCommunityPost = async (communityId: number): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data as PostWithCommunity[]
}

const CommunityDisplay = ({ communityId }: Props) => {

  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId)
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading communities...</p>
    </div>
  )

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="md:pt-24 pt-18 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            { data?.[0]?.communities?.name || "Community" } Posts
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Explore discussions in this community
          </p>
          <div className="h-px bg-linear-to-r from-neutral-200 to-white mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {data?.length === 0 ? (
            <p className="text-neutral-500 col-span-full">No posts in this community yet.</p>
          ) : (
            data?.map((post, index) => (
              <PostItem key={index} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityDisplay
