import { Navigate, Route, Routes } from 'react-router-dom'
import {
  Home,
  Layout,
  Dashboard,
  WriteArticle,
  BlogTitles,
  GenerateImages,
  RemoveBackground,
  RemoveObject,
  ReviewResume,
  Community
} from "./pages"
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'

const App = () => {

  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* TODO: Add a skeleton */}
        <Loader />
      </div>
    )
  }
  
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={isSignedIn ? <Navigate to="/ai" replace /> : <Home />}  />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App