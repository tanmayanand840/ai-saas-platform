import { Navigate, Route, Routes } from 'react-router-dom'
import {
  Home,
  Layout,
  Dashboard,
  WriteArticle,
  BlogTitles,
  ReviewResume,
  DocumentChat,
  Upgrade, EmailWriter, TextSummarizer, CoverLetterGenerator, CodeReviewer
} from "./pages"
import PremiumRoute from "./components/PremiumRoute"
import { useAuth } from '@clerk/clerk-react'
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
        <Route path='/ai-document-chat' element={<Navigate to="/ai/document-chat" replace />} />
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='document-chat' element={<PremiumRoute><DocumentChat /></PremiumRoute>} />
          <Route path='email-writer' element={<PremiumRoute><EmailWriter /></PremiumRoute>} />
          <Route path='summarizer' element={<PremiumRoute><TextSummarizer /></PremiumRoute>} />
          <Route path='cover-letter' element={<PremiumRoute><CoverLetterGenerator /></PremiumRoute>} />
          <Route path='code-reviewer' element={<PremiumRoute><CodeReviewer /></PremiumRoute>} />
          <Route path='upgrade' element={<Upgrade />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
