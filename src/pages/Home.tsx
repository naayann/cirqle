import PostList from "../components/PostList"

const Home = () => {
  return (
    <div className="pt-24 px-6">

      <div className="max-w-5xl mx-auto">

        {/* Heading Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Recent Posts
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Discover what others are sharing
          </p>

          <div className="h-px bg-neutral-200 mt-4"></div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          <PostList/>
        </div>

      </div>

    </div>
  )
}

export default Home