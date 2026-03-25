import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {

  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle()

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message)
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue })
    if (error) throw new Error(error.message)
  }
}

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)

  if (error) throw new Error(error.message)
  return data as Vote[]
}

const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth()

  const queryClient = useQueryClient()

  const { data: votes, isLoading, error } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000
  })

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in to Vote!")
      return vote(voteValue, postId, user!.id)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] })
    }
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading votes...</p>
    </div>
  )

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  const likes = votes?.filter((v) => v.vote === 1).length || 0
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote

  return (
    <div className="mt-6 flex justify-start">
      <div className="flex items-center gap-2 border border-neutral-200 bg-white px-2 py-1">

        <button
          onClick={() => mutate(1)}
          className={`vote-btn flex items-center gap-1.5 px-3 py-1.5 text-sm transition active:scale-95 ${userVote === 1
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
            }`}
        >
          <FiThumbsUp
            className={`text-[16px] ${userVote === 1 ? "vote-pop" : ""
              }`}
          />
          <span className="font-medium">{likes}</span>
        </button>

        <div className="w-px h-5 bg-neutral-200" />

        <button
          onClick={() => mutate(-1)}
          className={`vote-btn flex items-center gap-1.5 px-3 py-1.5 text-sm transition active:scale-95 ${userVote === -1
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
            }`}
        >
          <FiThumbsDown
            className={`text-[16px] ${userVote === -1 ? "vote-pop" : ""
              }`}
          />
          <span className="font-medium">{dislikes}</span>
        </button>

      </div>
    </div>
  );
};

export default LikeButton
