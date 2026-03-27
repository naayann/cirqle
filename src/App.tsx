import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreatePostPage from './pages/CreatePostPage'
import PostPage from './pages/PostPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CommunitiesPage from './pages/CommunitiesPage'

function App() {

  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/create' element={<CreatePostPage/>} />
          <Route path='/post/:id' element={<PostPage/>} />
          <Route path='/community/create' element={<CreateCommunityPage/>} />
          <Route path='/communities' element={<CommunitiesPage/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
