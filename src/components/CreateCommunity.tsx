import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
    const { error, data } = await supabase.from("communities").insert(community)
  
    if (error) throw new Error(error.message)
    return data
}

const CreateCommunity = () => {

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] })
      navigate("/communities")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ name, description })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 px-6">
        <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Community Name
          </label>
          <input
            type="text"
            id="name"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white/80 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            placeholder="Enter community name..."
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Description
          </label>
          <textarea
            rows={4}
            id="description"
            required
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white/80 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            placeholder="Describe your community..."
          />
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
            "Create Community"
          )}
        </button>

        {isError && (
          <p className="text-sm text-red-500 mt-2">
            Error creating community
          </p>
        )}

      </div>
    </form>
  )
}

export default CreateCommunity
