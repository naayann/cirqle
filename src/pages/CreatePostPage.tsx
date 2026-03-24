import CreatePost from "../components/CreatePost"

const CreatePostPage = () => {
  return (
    <div className="pt-24 px-6">

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Create New Post
        </h2>

        <p className="text-sm text-neutral-500 mt-1">
          Share your thoughts with the community
        </p>
      </div>

      <CreatePost/>

    </div>
  )
}

export default CreatePostPage