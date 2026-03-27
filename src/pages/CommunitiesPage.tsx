import CommunityList from '../components/CommunityList'

const CommunitiesPage = () => {
  return (
    <div className="md:pt-24 pt-18 px-6">

      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Communities
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Explore other communities
          </p>

          <div className="h-px bg-linear-to-r from-neutral-200 to-white mt-4"></div>
        </div>

        <div className="space-y-6">
          <CommunityList/>
        </div>

      </div>

    </div>
  )
}

export default CommunitiesPage
