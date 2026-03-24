import PostList from "../components/PostList"

const Home = () => {
  return (
    <div className="md:pt-24 pt-18 px-6">

      <div className="max-w-5xl mx-auto">

        {/* Heading Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Recent Posts
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Discover what others are sharing
          </p>

          <div className="h-px bg-linear-to-r from-neutral-200 to-white mt-4"></div>
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