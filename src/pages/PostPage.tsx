import { useParams } from "react-router"
import PostDetail from "../components/PostDetail"

const PostPage = () => {
  const {id} = useParams<{id: string}>()
  return (
    <div>
      <PostDetail postId={Number(id)}/>
    </div>
  )
}

export default PostPage
