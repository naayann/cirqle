import CreateCommunity from "../components/CreateCommunity"

const CreateCommunityPage = () => {
  return (
      <div className="pt-24 px-6">
  
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Create New Community
          </h2>
  
          <p className="text-sm text-neutral-500 mt-1">
            Assemble your own teams
          </p>
        </div>
  
        <CreateCommunity/>
  
      </div>
    )
}

export default CreateCommunityPage
