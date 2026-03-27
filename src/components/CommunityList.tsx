import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router';
import { supabase } from '../supabase-client';

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data as Community[]
}

const CommunityList = () => {

  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities
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
    <div>
      <div className="max-w-5xl mx-auto">

        {/* List */}
        <div className="space-y-4">
          {data?.map((community, index) => (
            <Link
              to={`/community/${community.id}`}
              key={index}
              className="group block bg-white/70 backdrop-blur-md border border-neutral-200 rounded-xl p-5 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm"
            >

              {/* Top */}
              <div className="flex items-start gap-4">

                {/* Avatar */}
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-[15px] font-semibold shrink-0">
                  {community.name?.charAt(0).toUpperCase()}
                </div>

                {/* Title + Meta */}
                <div className="flex flex-col flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[15px] font-semibold text-neutral-900 truncate">
                      {community.name}
                    </h3>

                    <span className="text-xs text-neutral-400 transition">
                      View →
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mt-0.5">
                    Community
                  </p>

                </div>

              </div>

              <p className="mt-4 text-[14px] text-neutral-600 leading-relaxed line-clamp-2">
                {community.description}
              </p>

              <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between">

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Active
                </div>

                <button className="text-xs font-medium px-4 py-1.5 rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition">
                  Join
                </button>

              </div>

            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}

export default CommunityList
